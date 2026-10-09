import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

const mockCheckMessage = jest.fn();
const mockGenerateSADrills = jest.fn();

jest.mock('@/lib/deepseek', () => ({
  ...jest.requireActual('@/lib/deepseek'),
  checkMessage: (...args: unknown[]) => mockCheckMessage(...args),
  generateSADrills: (...args: unknown[]) => mockGenerateSADrills(...args),
}));

import i18n from '@/i18n';
import { DRILLS, getDrills } from '@/data/drills';
import { useAppStore } from '@/store/useAppStore';

import PracticeScreen from '@/app/(tabs)/practice';

const initialState = useAppStore.getState();

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

const sampleDrill = {
  channel: 'SMS',
  from: 'Unknown number',
  body: 'Your SASSA grant has been paused, click here: sassa-reactivate.co.za',
  isScam: true,
  explain: 'SASSA never asks you to reactivate a grant via an SMS link.',
};

describe('PracticeScreen — AI message checker', () => {
  beforeEach(() => {
    useAppStore.setState(initialState, true);
    mockCheckMessage.mockReset();
    mockGenerateSADrills.mockReset();
    // The daily-practice section now generates on mount regardless of which part of the screen
    // a test cares about — give it a harmless default so mount never hangs/errors here.
    mockGenerateSADrills.mockResolvedValue({ ok: true, drills: [sampleDrill] });
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

describe('PracticeScreen — daily practice drills (AI-generated, real-sourced fallback)', () => {
  beforeEach(() => {
    useAppStore.setState(initialState, true);
    mockCheckMessage.mockReset();
    mockGenerateSADrills.mockReset();
  });

  it('auto-generates drills on load (no button press needed) and shows a skeleton while the first batch loads', async () => {
    const { promise, resolve } = deferred<{ ok: true; drills: typeof sampleDrill[] }>();
    mockGenerateSADrills.mockReturnValue(promise);

    const { getByTestId, getByText, queryByTestId } = await render(<PracticeScreen />);

    expect(mockGenerateSADrills).toHaveBeenCalledTimes(1);
    expect(getByTestId('daily-drills-skeleton')).toBeTruthy();

    await act(async () => {
      resolve({ ok: true, drills: [sampleDrill] });
      await promise;
    });

    expect(getByText(sampleDrill.body)).toBeTruthy();
    expect(queryByTestId('daily-drills-skeleton')).toBeNull();
  });

  it('shows the AI-generated drills as the primary practice list on success, not the static ones', async () => {
    mockGenerateSADrills.mockResolvedValue({ ok: true, drills: [sampleDrill] });
    const { getByText, queryByText } = await render(<PracticeScreen />);

    await waitFor(() => expect(getByText(sampleDrill.body)).toBeTruthy());
    expect(getByText('AI-generated — not real reported scams')).toBeTruthy();
    expect(queryByText(DRILLS[0].body)).toBeNull();
  });

  it('falls back to the real sourced drills if the initial generation fails', async () => {
    mockGenerateSADrills.mockResolvedValue({ ok: false, error: 'network' });
    const { getByText, queryByText } = await render(<PracticeScreen />);

    await waitFor(() => expect(getByText(DRILLS[0].body)).toBeTruthy());
    expect(getByText("Couldn't generate new examples right now — showing saved examples instead.")).toBeTruthy();
    expect(queryByText('AI-generated — not real reported scams')).toBeNull();
  });

  it('falls back to the real sourced drills if the model returns zero drills on the first load', async () => {
    mockGenerateSADrills.mockResolvedValue({ ok: true, drills: [] });
    const { getByText } = await render(<PracticeScreen />);

    await waitFor(() => expect(getByText(DRILLS[0].body)).toBeTruthy());
    expect(getByText("Couldn't generate new examples right now — showing saved examples instead.")).toBeTruthy();
  });

  it('lets the student answer a fallback drill using the existing stored progress, like before', async () => {
    mockGenerateSADrills.mockResolvedValue({ ok: false, error: 'network' });
    const { getByText, getAllByText } = await render(<PracticeScreen />);
    await waitFor(() => expect(getByText(DRILLS[0].body)).toBeTruthy());

    // DRILLS[0] is a scam (SARS SMS) — its "Scam" choice is the first one in the fallback list.
    const correctChoiceLabel = DRILLS[0].isScam ? 'Scam' : 'Legit';
    await fireEvent.press(getAllByText(correctChoiceLabel)[0]);

    expect(getByText(/Correct/)).toBeTruthy();
    expect(useAppStore.getState().drillPicks[0]).toBe(DRILLS[0].isScam ? 'scam' : 'safe');
  });

  it('replaces the fallback with freshly generated drills once a retry succeeds', async () => {
    mockGenerateSADrills.mockResolvedValueOnce({ ok: false, error: 'network' });
    mockGenerateSADrills.mockResolvedValueOnce({ ok: true, drills: [sampleDrill] });

    const { getByText, queryByText } = await render(<PracticeScreen />);
    await waitFor(() => expect(getByText(DRILLS[0].body)).toBeTruthy());

    await fireEvent.press(getByText('Get new examples'));

    await waitFor(() => expect(getByText(sampleDrill.body)).toBeTruthy());
    expect(queryByText(DRILLS[0].body)).toBeNull();
    expect(mockGenerateSADrills).toHaveBeenCalledTimes(2);
  });

  it('keeps showing the previous drills while refreshing, then swaps in the new set', async () => {
    mockGenerateSADrills.mockResolvedValueOnce({ ok: true, drills: [sampleDrill] });
    const { promise, resolve } = deferred<{ ok: true; drills: typeof sampleDrill[] }>();
    mockGenerateSADrills.mockReturnValueOnce(promise);

    const { getByText, getByTestId } = await render(<PracticeScreen />);
    await waitFor(() => expect(getByText(sampleDrill.body)).toBeTruthy());

    await act(async () => {
      fireEvent.press(getByText('Get new examples'));
    });

    // Stale content stays visible while the refresh is in flight.
    expect(getByText(sampleDrill.body)).toBeTruthy();
    expect(getByTestId('daily-drills-refreshing')).toBeTruthy();

    const secondDrill = { ...sampleDrill, body: 'A brand new SA scam example message.' };
    await act(async () => {
      resolve({ ok: true, drills: [secondDrill] });
      await promise;
    });

    expect(getByText(secondDrill.body)).toBeTruthy();
  });

  it('keeps the previous drills and shows an inline error if a refresh fails, instead of falling back to static', async () => {
    mockGenerateSADrills.mockResolvedValueOnce({ ok: true, drills: [sampleDrill] });
    mockGenerateSADrills.mockResolvedValueOnce({ ok: false, error: 'rate-limited' });

    const { getByText, queryByText } = await render(<PracticeScreen />);
    await waitFor(() => expect(getByText(sampleDrill.body)).toBeTruthy());

    await fireEvent.press(getByText('Get new examples'));

    await waitFor(() => expect(getByText('Too many requests right now — wait a moment and try again.')).toBeTruthy());
    expect(getByText(sampleDrill.body)).toBeTruthy();
    expect(queryByText(DRILLS[0].body)).toBeNull();
  });

  it('ignores a second tap on Get new examples while a refresh is still in flight (double-tap guard)', async () => {
    mockGenerateSADrills.mockResolvedValueOnce({ ok: true, drills: [sampleDrill] });
    const { promise, resolve } = deferred<{ ok: true; drills: typeof sampleDrill[] }>();
    mockGenerateSADrills.mockReturnValueOnce(promise);

    const { getByText } = await render(<PracticeScreen />);
    await waitFor(() => expect(getByText(sampleDrill.body)).toBeTruthy());

    const button = getByText('Get new examples');
    await act(async () => {
      fireEvent.press(button);
      fireEvent.press(button);
      resolve({ ok: true, drills: [sampleDrill] });
      await promise;
    });

    expect(mockGenerateSADrills).toHaveBeenCalledTimes(2); // 1 for initial mount load + 1 for the (single) refresh
  });
});

describe('PracticeScreen — follows the chosen language', () => {
  beforeEach(() => {
    mockCheckMessage.mockReset();
    mockGenerateSADrills.mockReset();
    mockGenerateSADrills.mockResolvedValue({ ok: true, drills: [sampleDrill] });
  });

  afterEach(async () => {
    await i18n.changeLanguage('en');
    useAppStore.setState(initialState, true);
  });

  it.each(['zu', 'nso', 'ts'] as const)('asks the AI for practice messages in %s', async (lang) => {
    useAppStore.setState({ ...initialState, language: lang }, true);
    await i18n.changeLanguage(lang);
    await render(<PracticeScreen />);
    await waitFor(() => expect(mockGenerateSADrills).toHaveBeenCalled());
    expect(mockGenerateSADrills.mock.calls[0][1]).toBe(lang);
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

  it('shows the saved examples in the chosen language when the AI is unavailable, with nothing left in English', async () => {
    useAppStore.setState({ ...initialState, language: 'ts' }, true);
    await i18n.changeLanguage('ts');
    mockGenerateSADrills.mockResolvedValue({ ok: false, error: 'network' });

    const { getByText, queryByText } = await render(<PracticeScreen />);
    await waitFor(() => expect(getByText(i18n.t('dailyPracticeFallbackNote', { lng: 'ts' }) as string)).toBeTruthy());
    const saved = getDrills('ts');
    expect(getByText(saved[0].body)).toBeTruthy();
    expect(getByText(i18n.t('practiceSubtitle', { lng: 'ts' }) as string)).toBeTruthy();
    expect(queryByText(DRILLS[0].body)).toBeNull();
    expect(queryByText(/Daily drill/)).toBeNull();
  });

  it('marks a saved example right or wrong the same way in every language', async () => {
    for (const lang of ['zu', 'nso', 'ts'] as const) {
      expect(getDrills(lang).map((d) => d.isScam)).toEqual(DRILLS.map((d) => d.isScam));
      expect(getDrills(lang).map((d) => d.channel)).toEqual(DRILLS.map((d) => d.channel));
    }
  });

  it('fetches practice messages again, in the new language, when the student switches language', async () => {
    useAppStore.setState({ ...initialState, language: 'en' }, true);
    await render(<PracticeScreen />);
    await waitFor(() => expect(mockGenerateSADrills).toHaveBeenCalledTimes(1));

    await act(async () => {
      useAppStore.getState().setLanguage('zu');
    });
    await waitFor(() => expect(mockGenerateSADrills).toHaveBeenCalledTimes(2));
    expect(mockGenerateSADrills.mock.calls[1][1]).toBe('zu');
  });
});
