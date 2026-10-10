import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

const mockCheckMessage = jest.fn();
const mockLoadDailyQuestions = jest.fn();
const mockCheckScreenshot = jest.fn();
const mockPickScreenshot = jest.fn();

jest.mock('@/lib/deepseek', () => ({
  ...jest.requireActual('@/lib/deepseek'),
  checkMessage: (...args: unknown[]) => mockCheckMessage(...args),
  checkScreenshot: (...args: unknown[]) => mockCheckScreenshot(...args),
}));

jest.mock('@/lib/daily-practice', () => ({
  ...jest.requireActual('@/lib/daily-practice'),
  loadDailyQuestions: (...args: unknown[]) => mockLoadDailyQuestions(...args),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
}));

jest.mock('@/lib/pick-screenshot', () => ({
  pickScreenshot: (...args: unknown[]) => mockPickScreenshot(...args),
}));

import i18n from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

import PracticeScreen from '@/app/(tabs)/practice';

const initialState = useAppStore.getState();

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

const sampleQuestion = {
  topicId: '01-1',
  moduleId: '01',
  lessonN: 1,
  text: 'A shop asks for your ID number. What should you do first?',
  options: ['Give it', 'Ask why they need it', 'Walk away', 'Give a fake one'],
  correct: 1,
  explain: 'You have the right to know why your information is collected.',
  source: 'ai' as const,
};

describe('PracticeScreen — AI message checker', () => {
  beforeEach(() => {
    useAppStore.setState(initialState, true);
    mockCheckMessage.mockReset();
    mockLoadDailyQuestions.mockReset();
    // The daily questions load on mount whichever part of the screen a test cares about — give
    // them a harmless default so mount never hangs or errors here.
    mockLoadDailyQuestions.mockResolvedValue({ ok: true, questions: [sampleQuestion] });
  });

  it('keeps the check button disabled until a non-empty message is entered', async () => {
    const { getByText, getByPlaceholderText } = await render(<PracticeScreen />);
    const button = getByText('Check a message');
    expect(button.parent?.props.accessibilityState?.disabled ?? true).toBeTruthy();

    await fireEvent.changeText(getByPlaceholderText('Paste a message to check…'), '   ');
    expect(button.parent?.props.accessibilityState?.disabled ?? true).toBeTruthy();

    await fireEvent.changeText(getByPlaceholderText('Paste a message to check…'), 'Hello there');
    await waitFor(() => expect(button.parent?.props.accessibilityState?.disabled).toBeFalsy());
  });

  it('shows a live character counter as the student types', async () => {
    const { getByPlaceholderText, getByText } = await render(<PracticeScreen />);
    await fireEvent.changeText(getByPlaceholderText('Paste a message to check…'), 'Hello');
    expect(getByText('5 / 1000')).toBeTruthy();
  });

  it('shows an over-limit message and disables the button past the character cap', async () => {
    const { getByPlaceholderText, getByText } = await render(<PracticeScreen />);
    await fireEvent.changeText(getByPlaceholderText('Paste a message to check…'), 'a'.repeat(1001));
    expect(getByText('Message is too long — shorten it to continue.')).toBeTruthy();
    const button = getByText('Check a message');
    expect(button.parent?.props.accessibilityState?.disabled).toBeTruthy();
  });

  it('shows a loading indicator while the check is in flight, then the verdict on success', async () => {
    const { promise, resolve } = deferred<{ ok: true; verdict: string; confidence: string; redFlags: string[]; explanation: string }>();
    mockCheckMessage.mockReturnValue(promise);

    const { getByPlaceholderText, getByText, getByTestId } = await render(<PracticeScreen />);
    await fireEvent.changeText(getByPlaceholderText('Paste a message to check…'), 'Send me your PIN now');
    // The press's own promise (which awaits the still-pending mock) is deliberately not awaited
    // inside this act() scope — only its synchronous prefix (setChecking(true)) needs to flush
    // here, so the loading state below can be asserted before the mock resolves.
    await act(async () => {
      fireEvent.press(getByText('Check a message'));
    });

    expect(getByTestId('message-check-loading')).toBeTruthy();

    await act(async () => {
      resolve({ ok: true, verdict: 'scam', confidence: 'high', redFlags: ['Asks for a PIN'], explanation: 'This is a classic scam pattern.' });
      await promise;
    });

    expect(getByText('Likely a scam')).toBeTruthy();
    expect(getByText(/Confidence/)).toBeTruthy();
    expect(getByText(/Asks for a PIN/)).toBeTruthy();
    expect(getByText('This is a classic scam pattern.')).toBeTruthy();
  });

  it('maps a legit verdict to its own label', async () => {
    mockCheckMessage.mockResolvedValue({ ok: true, verdict: 'legit', confidence: 'medium', redFlags: [], explanation: 'Nothing suspicious here.' });
    const { getByPlaceholderText, getByText } = await render(<PracticeScreen />);
    await fireEvent.changeText(getByPlaceholderText('Paste a message to check…'), 'Your statement is ready on the portal.');
    await fireEvent.press(getByText('Check a message'));

    expect(getByText('Likely legit')).toBeTruthy();
    expect(getByText('No red flags found')).toBeTruthy();
  });

  it('shows a human, inline error with a retry button instead of a blank result on failure', async () => {
    mockCheckMessage.mockResolvedValue({ ok: false, error: 'network' });
    const { getByPlaceholderText, getByText } = await render(<PracticeScreen />);
    await fireEvent.changeText(getByPlaceholderText('Paste a message to check…'), 'Is this legit?');
    await fireEvent.press(getByText('Check a message'));

    expect(getByText("Couldn't reach the AI service — check your connection and try again.")).toBeTruthy();
    expect(getByText('Try again')).toBeTruthy();
  });

  it('retries the same message when "Try again" is pressed after a failure', async () => {
    mockCheckMessage.mockResolvedValueOnce({ ok: false, error: 'network' });
    mockCheckMessage.mockResolvedValueOnce({ ok: true, verdict: 'unsure', confidence: 'low', redFlags: [], explanation: 'Hard to tell.' });

    const { getByPlaceholderText, getByText } = await render(<PracticeScreen />);
    await fireEvent.changeText(getByPlaceholderText('Paste a message to check…'), 'Is this legit?');
    await fireEvent.press(getByText('Check a message'));
    await fireEvent.press(getByText('Try again'));

    expect(mockCheckMessage).toHaveBeenCalledTimes(2);
    expect(getByText('Not sure')).toBeTruthy();
  });

  it('ignores a second tap on Check a message while the first check is still in flight (double-tap guard)', async () => {
    const { promise, resolve } = deferred<{ ok: true; verdict: string; confidence: string; redFlags: string[]; explanation: string }>();
    mockCheckMessage.mockReturnValue(promise);

    const { getByPlaceholderText, getByText } = await render(<PracticeScreen />);
    await fireEvent.changeText(getByPlaceholderText('Paste a message to check…'), 'Send me your PIN now');

    const button = getByText('Check a message');
    // Both presses, and resolving the mock, happen inside a single act() scope: the first
    // press's synchronous prefix (which flips the in-flight ref) runs before the second press
    // fires, so the second press — fired before either promise settles — exercises the real
    // double-tap race, without leaving a separate, undrained act() scope behind.
    await act(async () => {
      fireEvent.press(button);
      fireEvent.press(button);
      resolve({ ok: true, verdict: 'scam', confidence: 'high', redFlags: [], explanation: 'x' });
      await promise;
    });

    expect(mockCheckMessage).toHaveBeenCalledTimes(1);
  });
});

describe('PracticeScreen — checking a screenshot', () => {
  const screenshot = { uri: 'file:///shot.png', base64: 'aGVsbG8=', mimeType: 'image/png' };
  const scamResult = { ok: true, verdict: 'scam', confidence: 'high', redFlags: ['Asks for a PIN'], explanation: 'Classic phishing email.' };

  beforeEach(() => {
    useAppStore.setState(initialState, true);
    mockCheckMessage.mockReset();
    mockCheckScreenshot.mockReset();
    mockPickScreenshot.mockReset();
    mockLoadDailyQuestions.mockReset();
    mockLoadDailyQuestions.mockResolvedValue({ ok: true, questions: [sampleQuestion] });
  });

  async function renderWithScreenshot() {
    mockPickScreenshot.mockResolvedValue({ ok: true, screenshot });
    const utils = await render(<PracticeScreen />);
    await fireEvent.press(utils.getByText('Add a screenshot'));
    await waitFor(() => expect(utils.getByTestId('screenshot-preview')).toBeTruthy());
    return utils;
  }

  it('offers an "Add a screenshot" button with a privacy note, before anything is chosen', async () => {
    const { getByText, queryByTestId } = await render(<PracticeScreen />);
    expect(getByText('Add a screenshot')).toBeTruthy();
    expect(getByText(/Crop out anything personal/)).toBeTruthy();
    expect(queryByTestId('screenshot-preview')).toBeNull();
  });

  it('shows a preview of the chosen screenshot, swaps the text box for it, and enables the check button', async () => {
    const { getByTestId, getByText, queryByPlaceholderText, queryByText } = await renderWithScreenshot();

    expect(getByTestId('screenshot-preview').props.source).toEqual({ uri: screenshot.uri });
    expect(queryByPlaceholderText('Paste a message to check…')).toBeNull();
    expect(queryByText('Add a screenshot')).toBeNull();
    expect(getByText('Remove screenshot')).toBeTruthy();
    expect(getByText('Check this screenshot').parent?.props.accessibilityState?.disabled).toBeFalsy();
  });

  it('changes nothing and shows no error when the student closes the picker without choosing', async () => {
    mockPickScreenshot.mockResolvedValue({ ok: false, reason: 'cancelled' });
    const { getByText, getByPlaceholderText, queryByTestId, queryByText } = await render(<PracticeScreen />);
    await fireEvent.press(getByText('Add a screenshot'));

    expect(queryByTestId('screenshot-preview')).toBeNull();
    expect(getByPlaceholderText('Paste a message to check…')).toBeTruthy();
    expect(queryByText("Couldn't open that image — try a different one.")).toBeNull();
  });

  it('says so, right there, when the chosen image cannot be opened', async () => {
    mockPickScreenshot.mockResolvedValue({ ok: false, reason: 'unreadable' });
    const { getByText, queryByTestId } = await render(<PracticeScreen />);
    await fireEvent.press(getByText('Add a screenshot'));

    expect(getByText("Couldn't open that image — try a different one.")).toBeTruthy();
    expect(queryByTestId('screenshot-preview')).toBeNull();
    expect(getByText('Add a screenshot')).toBeTruthy();
  });

  it('refuses an image that is too large as soon as it is chosen, without sending it anywhere', async () => {
    const { SCREENSHOT_MAX_BASE64_LENGTH } = jest.requireActual('@/lib/deepseek');
    mockPickScreenshot.mockResolvedValue({
      ok: true,
      screenshot: { ...screenshot, base64: 'a'.repeat(SCREENSHOT_MAX_BASE64_LENGTH + 1) },
    });
    const { getByText, queryByTestId } = await render(<PracticeScreen />);
    await fireEvent.press(getByText('Add a screenshot'));

    expect(getByText('That image is too large — crop it or choose a smaller one.')).toBeTruthy();
    expect(queryByTestId('screenshot-preview')).toBeNull();
    expect(mockCheckScreenshot).not.toHaveBeenCalled();
  });

  it('refuses a file type the AI cannot read as soon as it is chosen', async () => {
    mockPickScreenshot.mockResolvedValue({ ok: true, screenshot: { ...screenshot, mimeType: 'image/heic' } });
    const { getByText, queryByTestId } = await render(<PracticeScreen />);
    await fireEvent.press(getByText('Add a screenshot'));

    expect(getByText("That file type isn't supported — use a JPG or PNG image.")).toBeTruthy();
    expect(queryByTestId('screenshot-preview')).toBeNull();
  });

  it('clears an earlier "could not open" error once a good screenshot is chosen', async () => {
    mockPickScreenshot.mockResolvedValueOnce({ ok: false, reason: 'unreadable' });
    mockPickScreenshot.mockResolvedValueOnce({ ok: true, screenshot });
    const { getByText, getByTestId, queryByText } = await render(<PracticeScreen />);
    await fireEvent.press(getByText('Add a screenshot'));
    await fireEvent.press(getByText('Add a screenshot'));

    await waitFor(() => expect(getByTestId('screenshot-preview')).toBeTruthy());
    expect(queryByText("Couldn't open that image — try a different one.")).toBeNull();
  });

  it('shows a spinner with text while the screenshot is being read, then the same verdict card as a pasted message', async () => {
    const { promise, resolve } = deferred<typeof scamResult>();
    mockCheckScreenshot.mockReturnValue(promise);
    const { getByText, getByTestId, queryByTestId } = await renderWithScreenshot();

    await act(async () => {
      fireEvent.press(getByText('Check this screenshot'));
    });
    expect(getByTestId('message-check-loading')).toBeTruthy();
    expect(getByText('Reading your screenshot…')).toBeTruthy();

    await act(async () => {
      resolve(scamResult);
      await promise;
    });

    expect(queryByTestId('message-check-loading')).toBeNull();
    expect(getByText('Likely a scam')).toBeTruthy();
    expect(getByText(/Asks for a PIN/)).toBeTruthy();
    expect(getByText('Classic phishing email.')).toBeTruthy();
  });

  it('changes the waiting text after a few seconds, so a slow upload still looks alive', async () => {
    const { promise, resolve } = deferred<typeof scamResult>();
    mockCheckScreenshot.mockReturnValue(promise);
    const { getByText, queryByText } = await renderWithScreenshot();

    jest.useFakeTimers();
    try {
      await act(async () => {
        fireEvent.press(getByText('Check this screenshot'));
      });
      expect(queryByText('Still checking — almost there…')).toBeNull();

      await act(async () => {
        jest.advanceTimersByTime(5000);
      });
      expect(getByText('Still checking — almost there…')).toBeTruthy();
      expect(queryByText('Reading your screenshot…')).toBeNull();

      await act(async () => {
        resolve(scamResult);
        await promise;
      });
      expect(queryByText('Still checking — almost there…')).toBeNull();
      expect(getByText('Likely a scam')).toBeTruthy();
    } finally {
      jest.useRealTimers();
    }
  });

  it('sends only the image data and file type to the AI, in the student\'s language, and never the pasted text', async () => {
    mockCheckScreenshot.mockResolvedValue(scamResult);
    const { getByText } = await renderWithScreenshot();
    await fireEvent.press(getByText('Check this screenshot'));

    expect(mockCheckScreenshot).toHaveBeenCalledWith({ base64: screenshot.base64, mimeType: screenshot.mimeType }, 'en');
    expect(mockCheckMessage).not.toHaveBeenCalled();
  });

  it('shows a human error with a retry that re-sends the same screenshot when the check fails', async () => {
    mockCheckScreenshot.mockResolvedValueOnce({ ok: false, error: 'network' });
    mockCheckScreenshot.mockResolvedValueOnce(scamResult);
    const { getByText, getByTestId } = await renderWithScreenshot();
    await fireEvent.press(getByText('Check this screenshot'));

    expect(getByText("Couldn't reach the AI service — check your connection and try again.")).toBeTruthy();
    // The screenshot is still attached, so the student does not have to pick it again.
    expect(getByTestId('screenshot-preview')).toBeTruthy();

    await fireEvent.press(getByText('Try again'));
    expect(mockCheckScreenshot).toHaveBeenCalledTimes(2);
    expect(getByText('Likely a scam')).toBeTruthy();
  });

  it('explains that no message was found in the picture, and offers no pointless retry of the same picture', async () => {
    mockCheckScreenshot.mockResolvedValue({ ok: false, error: 'no-text-found' });
    const { getByText, queryByText } = await renderWithScreenshot();
    await fireEvent.press(getByText('Check this screenshot'));

    expect(getByText("Couldn't find a message in that image — try a clearer screenshot.")).toBeTruthy();
    expect(queryByText('Try again')).toBeNull();
    expect(getByText('Remove screenshot')).toBeTruthy();
  });

  it('removing the screenshot brings back the text box with what was typed, and clears the old result', async () => {
    mockPickScreenshot.mockResolvedValue({ ok: true, screenshot });
    mockCheckScreenshot.mockResolvedValue(scamResult);
    const { getByText, getByPlaceholderText, getByTestId, queryByTestId, queryByText, getByDisplayValue } = await render(
      <PracticeScreen />
    );
    await fireEvent.changeText(getByPlaceholderText('Paste a message to check…'), 'Half-typed message');
    await fireEvent.press(getByText('Add a screenshot'));
    await waitFor(() => expect(getByTestId('screenshot-preview')).toBeTruthy());
    await fireEvent.press(getByText('Check this screenshot'));
    expect(getByText('Likely a scam')).toBeTruthy();

    await fireEvent.press(getByText('Remove screenshot'));

    expect(queryByTestId('screenshot-preview')).toBeNull();
    expect(queryByText('Likely a scam')).toBeNull();
    expect(getByDisplayValue('Half-typed message')).toBeTruthy();
    expect(getByText('Check a message')).toBeTruthy();
    expect(getByText('Add a screenshot')).toBeTruthy();
  });

  it('ignores a second tap on the check button while the first check is still in flight', async () => {
    const { promise, resolve } = deferred<typeof scamResult>();
    mockCheckScreenshot.mockReturnValue(promise);
    const { getByText } = await renderWithScreenshot();

    const button = getByText('Check this screenshot');
    await act(async () => {
      fireEvent.press(button);
      fireEvent.press(button);
      resolve(scamResult);
      await promise;
    });

    expect(mockCheckScreenshot).toHaveBeenCalledTimes(1);
  });

  it('ignores a second tap on "Add a screenshot" while the photo picker is still opening', async () => {
    const { promise, resolve } = deferred<{ ok: true; screenshot: typeof screenshot }>();
    mockPickScreenshot.mockReturnValue(promise);
    const { getByText } = await render(<PracticeScreen />);

    const button = getByText('Add a screenshot');
    await act(async () => {
      fireEvent.press(button);
      fireEvent.press(button);
      resolve({ ok: true, screenshot });
      await promise;
    });

    expect(mockPickScreenshot).toHaveBeenCalledTimes(1);
  });

  it('cannot remove or swap the screenshot while it is being checked', async () => {
    const { promise, resolve } = deferred<typeof scamResult>();
    mockCheckScreenshot.mockReturnValue(promise);
    const { getByText, getByTestId } = await renderWithScreenshot();

    await act(async () => {
      fireEvent.press(getByText('Check this screenshot'));
    });
    await act(async () => {
      fireEvent.press(getByText('Remove screenshot'));
    });
    expect(getByTestId('screenshot-preview')).toBeTruthy();

    await act(async () => {
      resolve(scamResult);
      await promise;
    });
    expect(getByText('Likely a scam')).toBeTruthy();
  });

  it('works in the chosen language: translated buttons, and the AI is asked to reply in that language', async () => {
    useAppStore.setState({ ...initialState, language: 'nso' }, true);
    await i18n.changeLanguage('nso');
    try {
      mockPickScreenshot.mockResolvedValue({ ok: true, screenshot });
      mockCheckScreenshot.mockResolvedValue({ ...scamResult, explanation: 'Ke bofora.' });
      const tr = (key: string) => i18n.t(key, { lng: 'nso' }) as string;

      const { getByText, getByTestId } = await render(<PracticeScreen />);
      await fireEvent.press(getByText(tr('addScreenshot')));
      await waitFor(() => expect(getByTestId('screenshot-preview')).toBeTruthy());
      expect(getByText(tr('screenshotPrivacyNote'))).toBeTruthy();
      await fireEvent.press(getByText(tr('checkScreenshot')));

      expect(mockCheckScreenshot).toHaveBeenCalledWith({ base64: screenshot.base64, mimeType: screenshot.mimeType }, 'nso');
      expect(getByText(tr('verdictScam'))).toBeTruthy();
      expect(getByText('Ke bofora.')).toBeTruthy();
    } finally {
      await i18n.changeLanguage('en');
    }
  });
});

describe('PracticeScreen — daily questions', () => {
  beforeEach(async () => {
    useAppStore.setState({ ...initialState, language: 'en' }, true);
    await i18n.changeLanguage('en');
    mockCheckMessage.mockReset();
    mockLoadDailyQuestions.mockReset();
    mockLoadDailyQuestions.mockResolvedValue({ ok: true, questions: [sampleQuestion] });
  });

  it('opens with today’s questions at the top, under a heading that says what they are', async () => {
    const { getByText } = await render(<PracticeScreen />);
    expect(getByText('Daily practice')).toBeTruthy();
    expect(getByText('Three new questions from your lesson notes, every day.')).toBeTruthy();
    await waitFor(() => expect(getByText(sampleQuestion.text)).toBeTruthy());
    expect(mockLoadDailyQuestions).toHaveBeenCalledTimes(1);
  });

  it('no longer shows the old scam-or-legit practice messages or their buttons', async () => {
    const { getByText, queryByText } = await render(<PracticeScreen />);
    await waitFor(() => expect(getByText(sampleQuestion.text)).toBeTruthy());
    expect(queryByText('Scam')).toBeNull();
    expect(queryByText('Legit')).toBeNull();
    expect(queryByText('Get new examples')).toBeNull();
  });

  it('answers a question right there on the screen', async () => {
    const { getByText } = await render(<PracticeScreen />);
    await waitFor(() => expect(getByText('Ask why they need it')).toBeTruthy());
    await fireEvent.press(getByText('Ask why they need it'));
    expect(getByText('Done for today')).toBeTruthy();
    expect(useAppStore.getState().streak).toBe(1);
  });

  it('keeps "Check a message" usable while the questions are still loading', async () => {
    mockLoadDailyQuestions.mockReturnValue(new Promise(() => {}));
    const { getByTestId, getByPlaceholderText, getByText } = await render(<PracticeScreen />);
    expect(getByTestId('daily-skeleton')).toBeTruthy();
    await fireEvent.changeText(getByPlaceholderText('Paste a message to check…'), 'Hello there');
    await waitFor(() => expect(getByText('Check a message').parent?.props.accessibilityState?.disabled).toBeFalsy());
  });

  it('keeps "Check a message" usable when the questions fail to load', async () => {
    mockLoadDailyQuestions.mockResolvedValue({ ok: false, error: 'network' });
    mockCheckMessage.mockResolvedValue({ ok: true, verdict: 'legit', confidence: 'medium', redFlags: [], explanation: 'Fine.' });
    const { getByText, getByPlaceholderText } = await render(<PracticeScreen />);
    await waitFor(() => expect(getByText("Couldn't load today's questions — check your connection and try again.")).toBeTruthy());
    await fireEvent.changeText(getByPlaceholderText('Paste a message to check…'), 'Is this legit?');
    await fireEvent.press(getByText('Check a message'));
    expect(getByText('Likely legit')).toBeTruthy();
  });

  it('leaves the reminder switch to the Profile screen', async () => {
    const { queryByText, queryByTestId } = await render(<PracticeScreen />);
    expect(queryByText('Daily reminder')).toBeNull();
    expect(queryByTestId('reminder-switch')).toBeNull();
  });
});

describe('PracticeScreen — follows the chosen language', () => {
  beforeEach(() => {
    mockCheckMessage.mockReset();
    mockLoadDailyQuestions.mockReset();
    mockLoadDailyQuestions.mockResolvedValue({ ok: true, questions: [sampleQuestion] });
  });

  afterEach(async () => {
    await i18n.changeLanguage('en');
    useAppStore.setState(initialState, true);
  });

  it.each(['zu', 'nso', 'ts'] as const)('asks for the daily questions in %s and shows the heading in that language', async (lang) => {
    useAppStore.setState({ ...initialState, language: lang }, true);
    await i18n.changeLanguage(lang);
    const { getByText, queryByText } = await render(<PracticeScreen />);
    await waitFor(() => expect(mockLoadDailyQuestions).toHaveBeenCalled());
    expect(mockLoadDailyQuestions.mock.calls[0][0]).toMatchObject({ lang });
    expect(getByText(i18n.t('practiceSubtitle', { lng: lang }) as string)).toBeTruthy();
    expect(queryByText(/Three new questions/)).toBeNull();
  });

  it('asks the AI to check a pasted message in the chosen language', async () => {
    useAppStore.setState({ ...initialState, language: 'nso' }, true);
    await i18n.changeLanguage('nso');
    mockCheckMessage.mockResolvedValue({ ok: true, verdict: 'scam', confidence: 'high', redFlags: [], explanation: 'Ke bofora.' });

    const { getByPlaceholderText, getByText } = await render(<PracticeScreen />);
    await fireEvent.changeText(getByPlaceholderText(i18n.t('messageCheckPlaceholder', { lng: 'nso' }) as string), 'Send your PIN');
    await fireEvent.press(getByText(i18n.t('checkMessage', { lng: 'nso' }) as string));

    await waitFor(() => expect(mockCheckMessage).toHaveBeenCalledWith('Send your PIN', 'nso'));
    await waitFor(() => expect(getByText(i18n.t('verdictScam', { lng: 'nso' }) as string)).toBeTruthy());
    expect(getByText('Ke bofora.')).toBeTruthy();
  });
});
