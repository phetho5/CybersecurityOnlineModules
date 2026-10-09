import {
  checkMessage,
  DEFAULT_GENERATED_DRILL_COUNT,
  generateSADrills,
  MESSAGE_CHECK_MAX_LENGTH,
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

describe('generateSADrills — language', () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY = ORIGINAL_KEY ?? 'test-deepseek-key';
    globalThis.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it.each(Object.entries(LANGUAGE_NAMES))('asks for the practice messages in the student\'s language (%s)', async (lang, name) => {
    mockFetchOnce(chatResponse({ drills: [] }));
    await generateSADrills(3, lang as keyof typeof LANGUAGE_NAMES);
    expect(sentPrompts().system).toContain(name);
  });

  it('does not add a language instruction for English, or when no language is given', async () => {
    mockFetchOnce(chatResponse({ drills: [] }));
    await generateSADrills();
    const withoutLanguage = sentPrompts().system;
    (globalThis.fetch as jest.Mock).mockClear();
    mockFetchOnce(chatResponse({ drills: [] }));
    await generateSADrills(3, 'en');
    expect(sentPrompts().system).toBe(withoutLanguage);
    for (const name of Object.values(LANGUAGE_NAMES)) expect(withoutLanguage).not.toContain(name);
  });

  it('tells the model to keep the channel values in English so the app can still read them', async () => {
    mockFetchOnce(chatResponse({ drills: [] }));
    await generateSADrills(2, 'zu');
    expect(sentPrompts().system).toMatch(/"channel"[^.]*must stay/i);
  });

  it('still clamps the count when a language is given', async () => {
    mockFetchOnce(chatResponse({ drills: [] }));
    await generateSADrills(99, 'ts');
    expect(sentPrompts().user).toContain('5');
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

describe('generateSADrills', () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY = ORIGINAL_KEY ?? 'test-deepseek-key';
    globalThis.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  const validDrill = {
    channel: 'SMS',
    from: 'Unknown number',
    body: 'Your SASSA grant has been paused, click here to reactivate: sassa-reactivate.co.za',
    isScam: true,
    explain: 'SASSA never asks you to reactivate a grant via an SMS link.',
  };

  it('returns a validated list of drills on success', async () => {
    mockFetchOnce(chatResponse({ drills: [validDrill] }));
    const result = await generateSADrills();
    expect(result).toEqual({ ok: true, drills: [validDrill] });
  });

  it('requests the default count when none is given', async () => {
    mockFetchOnce(chatResponse({ drills: [validDrill] }));
    await generateSADrills();
    const body = JSON.parse((globalThis.fetch as jest.Mock).mock.calls[0][1].body);
    const userMessage = body.messages.find((m: { role: string }) => m.role === 'user').content;
    expect(userMessage).toContain(String(DEFAULT_GENERATED_DRILL_COUNT));
  });

  it('clamps a requested count below 1 up to 1', async () => {
    mockFetchOnce(chatResponse({ drills: [validDrill] }));
    await generateSADrills(0);
    const body = JSON.parse((globalThis.fetch as jest.Mock).mock.calls[0][1].body);
    const userMessage = body.messages.find((m: { role: string }) => m.role === 'user').content;
    expect(userMessage).toContain('1');
  });

  it('clamps a requested count above 5 down to 5', async () => {
    mockFetchOnce(chatResponse({ drills: [validDrill] }));
    await generateSADrills(100);
    const body = JSON.parse((globalThis.fetch as jest.Mock).mock.calls[0][1].body);
    const userMessage = body.messages.find((m: { role: string }) => m.role === 'user').content;
    expect(userMessage).toContain('5');
  });

  it('returns ok with an empty list when the model returns zero drills (caller decides how to present that)', async () => {
    mockFetchOnce(chatResponse({ drills: [] }));
    const result = await generateSADrills();
    expect(result).toEqual({ ok: true, drills: [] });
  });

  it('reports a missing API key without calling the API', async () => {
    delete process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
    const result = await generateSADrills();
    expect(result).toEqual({ ok: false, error: 'missing-key' });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('reports network failure instead of throwing when fetch rejects', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('offline'));
    const result = await generateSADrills();
    expect(result).toEqual({ ok: false, error: 'network' });
  });

  it('maps HTTP 429 to a rate-limited error', async () => {
    mockFetchOnce({ ok: false, status: 429 });
    const result = await generateSADrills();
    expect(result).toEqual({ ok: false, error: 'rate-limited' });
  });

  it('reports invalid-response when a drill in the array is missing required fields', async () => {
    mockFetchOnce(chatResponse({ drills: [{ channel: 'SMS', from: 'x' }] }));
    const result = await generateSADrills();
    expect(result).toEqual({ ok: false, error: 'invalid-response' });
  });

  it('reports invalid-response when the top-level shape is not an object with a drills array', async () => {
    mockFetchOnce(chatResponse([validDrill]));
    const result = await generateSADrills();
    expect(result).toEqual({ ok: false, error: 'invalid-response' });
  });
});
