import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AudioPlayer } from '@/components/audio-player';

const mockPlay = jest.fn();
const mockPause = jest.fn();
const mockSetActiveForLockScreen = jest.fn();
const mockPlayer = { play: mockPlay, pause: mockPause, setActiveForLockScreen: mockSetActiveForLockScreen };
const mockUseAudioPlayer = jest.fn((_source: string) => mockPlayer);
let mockStatus: { isLoaded: boolean; isBuffering: boolean; playing: boolean; error?: string | null } = {
  isLoaded: false,
  isBuffering: true,
  playing: false,
  error: null,
};
const mockUseAudioPlayerStatus = jest.fn((_player: unknown) => mockStatus);

jest.mock('expo-audio', () => ({
  useAudioPlayer: (source: string) => mockUseAudioPlayer(source),
  useAudioPlayerStatus: (player: unknown) => mockUseAudioPlayerStatus(player),
}));

describe('AudioPlayer', () => {
  beforeEach(() => {
    mockPlay.mockClear();
    mockPause.mockClear();
    mockSetActiveForLockScreen.mockClear();
    mockUseAudioPlayer.mockClear();
  });

  it('shows a loading indicator while the audio is buffering', async () => {
    mockStatus = { isLoaded: false, isBuffering: true, playing: false, error: null };
    const { getByTestId } = await render(<AudioPlayer source="https://example.com/lesson.mp3" />);
    expect(getByTestId('audio-loading')).toBeTruthy();
  });

  it('shows a Play control once loaded and not yet playing', async () => {
    mockStatus = { isLoaded: true, isBuffering: false, playing: false, error: null };
    const { getByText } = await render(<AudioPlayer source="https://example.com/lesson.mp3" />);
    expect(getByText(/play/i)).toBeTruthy();
  });

  it('shows a Pause control while playing, and pauses on tap', async () => {
    mockStatus = { isLoaded: true, isBuffering: false, playing: true, error: null };
    const { getByText } = await render(<AudioPlayer source="https://example.com/lesson.mp3" />);
    await fireEvent.press(getByText(/pause/i));
    expect(mockPause).toHaveBeenCalledTimes(1);
  });

  it('starts playback when Play is tapped', async () => {
    mockStatus = { isLoaded: true, isBuffering: false, playing: false, error: null };
    const { getByText } = await render(<AudioPlayer source="https://example.com/lesson.mp3" />);
    await fireEvent.press(getByText(/play/i));
    expect(mockPlay).toHaveBeenCalledTimes(1);
  });

  it('shows a human error message (not a raw error dump) when loading fails', async () => {
    mockStatus = { isLoaded: false, isBuffering: false, playing: false, error: 'ERR_DECODER_INIT_FAILED_0x2' };
    const { getByText, queryByText } = await render(<AudioPlayer source="https://example.com/lesson.mp3" />);
    expect(getByText(/couldn.?t load the audio/i)).toBeTruthy();
    expect(queryByText(/ERR_DECODER/i)).toBeNull();
  });

  it('activates lock-screen/background controls with the lesson title when Play is tapped, so playback survives leaving the app', async () => {
    mockStatus = { isLoaded: true, isBuffering: false, playing: false, error: null };
    const { getByText } = await render(
      <AudioPlayer source="https://example.com/lesson.mp3" title="WhatsApp Scams" />
    );
    await fireEvent.press(getByText(/play/i));
    expect(mockSetActiveForLockScreen).toHaveBeenCalledWith(true, { title: 'WhatsApp Scams' });
  });
});
