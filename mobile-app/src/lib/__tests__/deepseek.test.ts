import {
  checkMessage,
  checkScreenshot,
  generateDailyQuestions,
  MESSAGE_CHECK_MAX_LENGTH,
  SCREENSHOT_MAX_BASE64_LENGTH,
  SCREENSHOT_MODEL,
  validateScreenshot,
} from '@/lib/deepseek';

const ORIGINAL_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;

function mockFetchOnce(response: Partial<Response> & { ok: boolean; status?: number; json?: () => Promise<unknown> }) {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(response as Response);
}

function chatResponse(content: unknown) {
  return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: JSON.stringify(content) } }] }) };
}

function sentPrompts() {
  const body = JSON.parse((globalThis.fetch as jest.Mock).mock.calls[0][1].body);
  return {
    system: body.messages.find((m: { role: string }) => m.role === 'system').content as string,
    user: body.messages.find((m: { role: string }) => m.role === 'user').content as string,
  };
}

const validCheck = { verdict: 'scam', confidence: 'high', redFlags: ['Asks for your PIN'], explanation: 'x' };
const LANGUAGE_NAMES = { zu: 'isiZulu', nso: 'Sepedi', ts: 'Xitsonga' } as const;

describe('checkMessage — reply language', () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY = ORIGINAL_KEY ?? 'test-deepseek-key';
    globalThis.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it.each(Object.entries(LANGUAGE_NAMES))('asks for the explanation in the student\'s language (%s)', async (lang, name) => {
    mockFetchOnce(chatResponse(validCheck));
    await checkMessage('Send me your PIN', lang as keyof typeof LANGUAGE_NAMES);
    expect(sentPrompts().system).toContain(name);
  });

  it('does not add a language instruction for English, or when no language is given', async () => {
    mockFetchOnce(chatResponse(validCheck));
    await checkMessage('Send me your PIN');
    const withoutLanguage = sentPrompts().system;
    (globalThis.fetch as jest.Mock).mockClear();
    mockFetchOnce(chatResponse(validCheck));
    await checkMessage('Send me your PIN', 'en');
    expect(sentPrompts().system).toBe(withoutLanguage);
    for (const name of Object.values(LANGUAGE_NAMES)) expect(withoutLanguage).not.toContain(name);
  });

  it('tells the model to keep the verdict and confidence values in English so the app can still read them', async () => {
    mockFetchOnce(chatResponse(validCheck));
    await checkMessage('Send me your PIN', 'nso');
    const { system } = sentPrompts();
    expect(system).toContain('"scam" | "legit" | "unsure"');
    expect(system).toMatch(/must stay in English/i);
  });

  it('still sends the student\'s message unchanged, whatever the language', async () => {
    mockFetchOnce(chatResponse(validCheck));
    await checkMessage('  Send me your PIN  ', 'ts');
    expect(sentPrompts().user).toBe('Send me your PIN');
  });

  it('still rejects a translated-language reply that breaks the expected shape', async () => {
    mockFetchOnce(chatResponse({ ...validCheck, verdict: 'bofora' }));
    expect(await checkMessage('Send me your PIN', 'nso')).toEqual({ ok: false, error: 'invalid-response' });
  });
});

describe('checkMessage', () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY = ORIGINAL_KEY ?? 'test-deepseek-key';
    globalThis.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it('returns a parsed verdict/confidence/redFlags/explanation on a valid response', async () => {
    mockFetchOnce(
      chatResponse({
        verdict: 'scam',
        confidence: 'high',
        redFlags: ['Asks for your PIN', 'Urgent 24-hour deadline'],
        explanation: 'This message pressures you to act fast and share a PIN, a classic scam pattern.',
      })
    );

    const result = await checkMessage('Your account will be suspended, reply with your PIN within 24 hours.');

    expect(result).toEqual({
      ok: true,
      verdict: 'scam',
      confidence: 'high',
      redFlags: ['Asks for your PIN', 'Urgent 24-hour deadline'],
      explanation: 'This message pressures you to act fast and share a PIN, a classic scam pattern.',
    });
  });

  it('rejects an empty message without calling the API', async () => {
    const result = await checkMessage('   ');
    expect(result).toEqual({ ok: false, error: 'invalid-input' });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('rejects a message longer than the max length without calling the API', async () => {
    const tooLong = 'a'.repeat(MESSAGE_CHECK_MAX_LENGTH + 1);
    const result = await checkMessage(tooLong);
    expect(result).toEqual({ ok: false, error: 'invalid-input' });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('accepts a message exactly at the max length', async () => {
    mockFetchOnce(chatResponse({ verdict: 'legit', confidence: 'medium', redFlags: [], explanation: 'Looks fine.' }));
    const exactLength = 'a'.repeat(MESSAGE_CHECK_MAX_LENGTH);
    const result = await checkMessage(exactLength);
    expect(result.ok).toBe(true);
  });

  it('reports a missing API key without calling the API', async () => {
    delete process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
    const result = await checkMessage('Is this a scam?');
    expect(result).toEqual({ ok: false, error: 'missing-key' });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('reports network failure instead of throwing when fetch rejects', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('offline'));
    const result = await checkMessage('Is this a scam?');
    expect(result).toEqual({ ok: false, error: 'network' });
  });

  it('reports network failure instead of throwing when the request is aborted (timeout)', async () => {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(abortError);
    const result = await checkMessage('Is this a scam?');
    expect(result).toEqual({ ok: false, error: 'network' });
  });

  it('maps HTTP 401 to an invalid-key error', async () => {
    mockFetchOnce({ ok: false, status: 401 });
    const result = await checkMessage('Is this a scam?');
    expect(result).toEqual({ ok: false, error: 'invalid-key' });
  });

  it('maps HTTP 429 to a rate-limited error', async () => {
    mockFetchOnce({ ok: false, status: 429 });
    const result = await checkMessage('Is this a scam?');
    expect(result).toEqual({ ok: false, error: 'rate-limited' });
  });

  it('maps HTTP 500 to a network error', async () => {
    mockFetchOnce({ ok: false, status: 500 });
    const result = await checkMessage('Is this a scam?');
    expect(result).toEqual({ ok: false, error: 'network' });
  });

  it('reports invalid-response when the model reply is not valid JSON', async () => {
    mockFetchOnce({ ok: true, status: 200, json: async () => ({ choices: [{ message: { content: 'not json' } }] }) });
    const result = await checkMessage('Is this a scam?');
    expect(result).toEqual({ ok: false, error: 'invalid-response' });
  });

  it('reports invalid-response when the JSON is valid but missing required fields', async () => {
    mockFetchOnce(chatResponse({ verdict: 'scam' }));
    const result = await checkMessage('Is this a scam?');
    expect(result).toEqual({ ok: false, error: 'invalid-response' });
  });

  it('reports invalid-response when verdict is an unexpected value', async () => {
    mockFetchOnce(chatResponse({ verdict: 'maybe', confidence: 'high', redFlags: [], explanation: 'x' }));
    const result = await checkMessage('Is this a scam?');
    expect(result).toEqual({ ok: false, error: 'invalid-response' });
  });

  it('reports invalid-response when the API response has no choices at all', async () => {
    mockFetchOnce({ ok: true, status: 200, json: async () => ({ choices: [] }) });
    const result = await checkMessage('Is this a scam?');
    expect(result).toEqual({ ok: false, error: 'invalid-response' });
  });
});

describe('validateScreenshot', () => {
  it('accepts a JPEG, PNG or WebP image of a sensible size', () => {
    for (const mimeType of ['image/jpeg', 'image/png', 'image/webp']) {
      expect(validateScreenshot({ base64: 'aGVsbG8=', mimeType })).toBeNull();
    }
  });

  it('accepts an image whose type the phone did not report (the AI service detects it from the file itself)', () => {
    expect(validateScreenshot({ base64: 'aGVsbG8=' })).toBeNull();
  });

  it('treats the file type case-insensitively', () => {
    expect(validateScreenshot({ base64: 'aGVsbG8=', mimeType: 'IMAGE/PNG' })).toBeNull();
  });

  it('rejects an empty image', () => {
    expect(validateScreenshot({ base64: '' })).toBe('invalid-input');
    expect(validateScreenshot({ base64: '   ' })).toBe('invalid-input');
  });

  it('rejects a file that is not a supported picture type', () => {
    expect(validateScreenshot({ base64: 'aGVsbG8=', mimeType: 'image/heic' })).toBe('unsupported-image');
    expect(validateScreenshot({ base64: 'aGVsbG8=', mimeType: 'video/mp4' })).toBe('unsupported-image');
    expect(validateScreenshot({ base64: 'aGVsbG8=', mimeType: 'application/pdf' })).toBe('unsupported-image');
  });

  it('accepts an image exactly at the size limit and rejects one just over it', () => {
    expect(validateScreenshot({ base64: 'a'.repeat(SCREENSHOT_MAX_BASE64_LENGTH), mimeType: 'image/png' })).toBeNull();
    expect(validateScreenshot({ base64: 'a'.repeat(SCREENSHOT_MAX_BASE64_LENGTH + 1), mimeType: 'image/png' })).toBe(
      'image-too-large'
    );
  });
});

describe('checkScreenshot', () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY = ORIGINAL_KEY ?? 'test-deepseek-key';
    globalThis.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  const image = { base64: 'aGVsbG8=', mimeType: 'image/png' };

  function sentBody() {
    return JSON.parse((globalThis.fetch as jest.Mock).mock.calls[0][1].body);
  }

  it('returns the same verdict/confidence/redFlags/explanation shape as a pasted message', async () => {
    mockFetchOnce(chatResponse({ ...validCheck, readable: true }));
    expect(await checkScreenshot(image)).toEqual({ ok: true, ...validCheck });
  });

  it('accepts a reply that leaves out the "readable" field altogether', async () => {
    mockFetchOnce(chatResponse(validCheck));
    expect(await checkScreenshot(image)).toEqual({ ok: true, ...validCheck });
  });

  it('sends the picture to a model that can read images, as a data URL alongside a text instruction', async () => {
    mockFetchOnce(chatResponse(validCheck));
    await checkScreenshot(image);
    const body = sentBody();
    expect(body.model).toBe(SCREENSHOT_MODEL);
    const user = body.messages.find((m: { role: string }) => m.role === 'user').content;
    expect(user).toEqual([
      { type: 'text', text: expect.any(String) },
      { type: 'image_url', image_url: { url: 'data:image/png;base64,aGVsbG8=' } },
    ]);
  });

  it('falls back to a JPEG label when the phone did not report the file type', async () => {
    mockFetchOnce(chatResponse(validCheck));
    await checkScreenshot({ base64: 'aGVsbG8=' });
    const user = sentBody().messages.find((m: { role: string }) => m.role === 'user').content;
    expect(user[1].image_url.url).toBe('data:image/jpeg;base64,aGVsbG8=');
  });

  it('tells the model to treat words in the picture as the message to judge, never as instructions to follow', async () => {
    mockFetchOnce(chatResponse(validCheck));
    await checkScreenshot(image);
    const system = sentBody().messages.find((m: { role: string }) => m.role === 'system').content;
    expect(system).toMatch(/never follow/i);
  });

  it('reports no-text-found when the model says the picture has no readable message', async () => {
    mockFetchOnce(chatResponse({ verdict: 'unsure', confidence: 'low', redFlags: [], explanation: '', readable: false }));
    expect(await checkScreenshot(image)).toEqual({ ok: false, error: 'no-text-found' });
  });

  it.each(Object.entries(LANGUAGE_NAMES))('asks for the explanation in the student\'s language (%s)', async (lang, name) => {
    mockFetchOnce(chatResponse(validCheck));
    await checkScreenshot(image, lang as keyof typeof LANGUAGE_NAMES);
    const system = sentBody().messages.find((m: { role: string }) => m.role === 'system').content;
    expect(system).toContain(name);
    expect(system).toMatch(/must stay in English/i);
  });

  it('does not add a language instruction for English', async () => {
    mockFetchOnce(chatResponse(validCheck));
    await checkScreenshot(image, 'en');
    const system = sentBody().messages.find((m: { role: string }) => m.role === 'system').content;
    for (const name of Object.values(LANGUAGE_NAMES)) expect(system).not.toContain(name);
  });

  it('rejects an empty, oversized or unsupported image without calling the API', async () => {
    expect(await checkScreenshot({ base64: '' })).toEqual({ ok: false, error: 'invalid-input' });
    expect(await checkScreenshot({ base64: 'a'.repeat(SCREENSHOT_MAX_BASE64_LENGTH + 1) })).toEqual({
      ok: false,
      error: 'image-too-large',
    });
    expect(await checkScreenshot({ base64: 'aGVsbG8=', mimeType: 'image/heic' })).toEqual({
      ok: false,
      error: 'unsupported-image',
    });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('reports a missing API key without calling the API', async () => {
    delete process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
    expect(await checkScreenshot(image)).toEqual({ ok: false, error: 'missing-key' });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('reports network failure instead of throwing when fetch rejects or times out', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('offline'));
    expect(await checkScreenshot(image)).toEqual({ ok: false, error: 'network' });

    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(abortError);
    expect(await checkScreenshot(image)).toEqual({ ok: false, error: 'network' });
  });

  it('maps HTTP 401, 429 and 500 to the same errors as a pasted message', async () => {
    mockFetchOnce({ ok: false, status: 401 });
    expect(await checkScreenshot(image)).toEqual({ ok: false, error: 'invalid-key' });
    mockFetchOnce({ ok: false, status: 429 });
    expect(await checkScreenshot(image)).toEqual({ ok: false, error: 'rate-limited' });
    mockFetchOnce({ ok: false, status: 500 });
    expect(await checkScreenshot(image)).toEqual({ ok: false, error: 'network' });
  });

  it('maps HTTP 400 (the service refused the picture itself) to an unsupported-image error', async () => {
    mockFetchOnce({ ok: false, status: 400 });
    expect(await checkScreenshot(image)).toEqual({ ok: false, error: 'unsupported-image' });
  });

  it('maps HTTP 413 (the upload was too big) to an image-too-large error', async () => {
    mockFetchOnce({ ok: false, status: 413 });
    expect(await checkScreenshot(image)).toEqual({ ok: false, error: 'image-too-large' });
  });

  it('reports invalid-response when the reply is not JSON, or is JSON in the wrong shape', async () => {
    mockFetchOnce({ ok: true, status: 200, json: async () => ({ choices: [{ message: { content: 'not json' } }] }) });
    expect(await checkScreenshot(image)).toEqual({ ok: false, error: 'invalid-response' });
    mockFetchOnce(chatResponse({ verdict: 'maybe', confidence: 'high', redFlags: [], explanation: 'x' }));
    expect(await checkScreenshot(image)).toEqual({ ok: false, error: 'invalid-response' });
    mockFetchOnce({ ok: true, status: 200, json: async () => ({ choices: [] }) });
    expect(await checkScreenshot(image)).toEqual({ ok: false, error: 'invalid-response' });
  });

  it('leaves a pasted-message check on its existing text model', async () => {
    mockFetchOnce(chatResponse(validCheck));
    await checkMessage('Send me your PIN');
    expect(sentBody().model).not.toBe(SCREENSHOT_MODEL);
  });
});

describe('generateDailyQuestions', () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY = ORIGINAL_KEY ?? 'test-deepseek-key';
    globalThis.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  const topics = [
    { title: 'What is POPIA?', notes: 'POPIA protects personal information such as your ID number.', avoid: ['Which law protects personal information?'] },
    { title: 'WhatsApp Scams', notes: 'Scammers pretend to be a family member with a new number.', avoid: [] },
  ];
  const question = (topic: number, text = 'A company wants your ID number. What should you check first?') => ({
    topic,
    text,
    options: ['Nothing', 'Why they need it', 'Their logo', 'Their age'],
    correct: 1,
    explain: 'POPIA says information must be collected for a specific purpose.',
  });

  it('returns the validated questions on success', async () => {
    mockFetchOnce(chatResponse({ questions: [question(1), question(2, 'Second?')] }));
    const result = await generateDailyQuestions(topics);
    expect(result).toEqual({ ok: true, questions: [question(1), question(2, 'Second?')] });
  });

  it('sends each topic’s lesson notes, numbered, and tells the model to stay inside them', async () => {
    mockFetchOnce(chatResponse({ questions: [] }));
    await generateDailyQuestions(topics);
    const { system, user } = sentPrompts();
    expect(user).toContain('Topic 1: What is POPIA?');
    expect(user).toContain('POPIA protects personal information such as your ID number.');
    expect(user).toContain('Topic 2: WhatsApp Scams');
    expect(user).toContain('Scammers pretend to be a family member with a new number.');
    expect(system).toMatch(/only[^.]*notes/i);
  });

  it('lists the questions already asked for a topic so the model does not repeat them', async () => {
    mockFetchOnce(chatResponse({ questions: [] }));
    await generateDailyQuestions(topics);
    const { system, user } = sentPrompts();
    expect(user).toContain('Which law protects personal information?');
    expect(system).toMatch(/already asked/i);
  });

  it('asks for real-life questions, not a made-up message to judge as a scam', async () => {
    mockFetchOnce(chatResponse({ questions: [] }));
    await generateDailyQuestions(topics);
    expect(sentPrompts().system).toMatch(/do not write a made-up message/i);
  });

  it('tells the model not to refer to "the notes", which the student cannot see next to the question', async () => {
    mockFetchOnce(chatResponse({ questions: [] }));
    await generateDailyQuestions(topics);
    expect(sentPrompts().system).toMatch(/never mention the notes/i);
  });

  it.each(Object.entries(LANGUAGE_NAMES))('asks for the questions in the student’s language (%s)', async (lang, name) => {
    mockFetchOnce(chatResponse({ questions: [] }));
    await generateDailyQuestions(topics, lang as keyof typeof LANGUAGE_NAMES);
    expect(sentPrompts().system).toContain(name);
  });

  it('adds no language instruction for English', async () => {
    mockFetchOnce(chatResponse({ questions: [] }));
    await generateDailyQuestions(topics, 'en');
    for (const name of Object.values(LANGUAGE_NAMES)) expect(sentPrompts().system).not.toContain(name);
  });

  it('drops a malformed question but keeps the good ones, instead of throwing the whole reply away', async () => {
    mockFetchOnce(
      chatResponse({
        questions: [
          question(1),
          { topic: 1, text: 'No options?' },
          { ...question(1), options: ['a', 'b', 'c'] },
          { ...question(1), options: ['a', 'b', 'c', 'd', 'e'] },
          { ...question(1), correct: 4 },
          { ...question(1), correct: -1 },
          { ...question(1), correct: 1.5 },
          { ...question(1), text: '   ' },
          { ...question(1), options: ['same', 'same', 'c', 'd'] },
          { ...question(1), options: ['a', '', 'c', 'd'] },
          { ...question(1), topic: 'one' },
          null,
        ],
      })
    );
    const result = await generateDailyQuestions(topics);
    expect(result).toEqual({ ok: true, questions: [question(1)] });
  });

  it('tidies stray spaces around the question and its options', async () => {
    mockFetchOnce(chatResponse({ questions: [{ ...question(1), text: '  Padded?  ', options: [' a ', 'b', 'c', 'd'] }] }));
    const result = await generateDailyQuestions(topics);
    expect(result).toMatchObject({ ok: true, questions: [{ text: 'Padded?', options: ['a', 'b', 'c', 'd'] }] });
  });

  it('accepts a question with no explanation', async () => {
    const { explain: _explain, ...bare } = question(1);
    mockFetchOnce(chatResponse({ questions: [bare] }));
    const result = await generateDailyQuestions(topics);
    expect(result).toMatchObject({ ok: true, questions: [{ text: bare.text, explain: '' }] });
  });

  it('returns ok with an empty list when the model writes no questions (the caller falls back to the notes)', async () => {
    mockFetchOnce(chatResponse({ questions: [] }));
    expect(await generateDailyQuestions(topics)).toEqual({ ok: true, questions: [] });
  });

  it('refuses to call the API with no topics', async () => {
    expect(await generateDailyQuestions([])).toEqual({ ok: false, error: 'invalid-input' });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('reports a missing API key without calling the API', async () => {
    delete process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
    expect(await generateDailyQuestions(topics)).toEqual({ ok: false, error: 'missing-key' });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('reports network failure instead of throwing when fetch rejects', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('offline'));
    expect(await generateDailyQuestions(topics)).toEqual({ ok: false, error: 'network' });
  });

  it('maps HTTP 429 to a rate-limited error and 401 to an invalid key', async () => {
    mockFetchOnce({ ok: false, status: 429 });
    expect(await generateDailyQuestions(topics)).toEqual({ ok: false, error: 'rate-limited' });
    mockFetchOnce({ ok: false, status: 401 });
    expect(await generateDailyQuestions(topics)).toEqual({ ok: false, error: 'invalid-key' });
  });

  it('reports invalid-response when the reply is not an object with a questions list, or is not JSON at all', async () => {
    mockFetchOnce(chatResponse([question(1)]));
    expect(await generateDailyQuestions(topics)).toEqual({ ok: false, error: 'invalid-response' });
    mockFetchOnce({ ok: true, status: 200, json: async () => ({ choices: [{ message: { content: 'Sure! Here you go' } }] }) });
    expect(await generateDailyQuestions(topics)).toEqual({ ok: false, error: 'invalid-response' });
  });
});
