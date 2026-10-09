import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { VideoPlayer } from '@/components/video-player';

const mockPlayer = { play: jest.fn(), pause: jest.fn(), status: 'loading' as string };
const mockUseVideoPlayer = jest.fn((_source: string) => mockPlayer);
let mockEventReturn: { status: string; error?: { message: string } } = { status: 'loading' };
const mockUseEvent = jest.fn(() => mockEventReturn);

jest.mock('expo-video', () => ({
  useVideoPlayer: (source: string) => mockUseVideoPlayer(source),
  VideoView: 'VideoView',
}));

jest.mock('expo', () => ({
  useEvent: () => mockUseEvent(),
}));

describe('VideoPlayer', () => {
  beforeEach(() => {
    mockUseVideoPlayer.mockClear();
  });

  it('shows a loading indicator while the video is still loading', async () => {
    mockEventReturn = { status: 'loading' };
    const { getByTestId } = await render(<VideoPlayer source="https://example.com/lesson.mp4" />);
    expect(getByTestId('video-loading')).toBeTruthy();
  });

  it('shows no loading indicator once the video is ready to play', async () => {
    mockEventReturn = { status: 'readyToPlay' };
    const { queryByTestId } = await render(<VideoPlayer source="https://example.com/lesson.mp4" />);
    expect(queryByTestId('video-loading')).toBeNull();
  });

  it('shows a human error message (not a raw error dump) and a retry action when loading fails', async () => {
    mockEventReturn = { status: 'error', error: { message: 'CODEC_NOT_SUPPORTED_0x8935' } };
    const { getByText, queryByText } = await render(<VideoPlayer source="https://example.com/lesson.mp4" />);
    expect(getByText(/couldn.?t load the video/i)).toBeTruthy();
    expect(getByText(/retry/i)).toBeTruthy();
    expect(queryByText(/CODEC_NOT_SUPPORTED/i)).toBeNull();
  });

  it('re-initializes the player when the student taps retry after an error', async () => {
    mockEventReturn = { status: 'error', error: { message: 'network error' } };
    const { getByText } = await render(<VideoPlayer source="https://example.com/lesson.mp4" />);
    const callsBefore = mockUseVideoPlayer.mock.calls.length;

    await fireEvent.press(getByText(/retry/i));

    expect(mockUseVideoPlayer.mock.calls.length).toBeGreaterThan(callsBefore);
  });
});
