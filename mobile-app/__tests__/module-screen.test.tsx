import { render } from '@testing-library/react-native';
import React from 'react';

const mockReplace = jest.fn();
const mockPush = jest.fn();
let mockParams: { id: string } = { id: '02' };

jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockPush(...args), replace: (...args: unknown[]) => mockReplace(...args) },
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@/components/video-player', () => ({
  VideoPlayer: ({ source }: { source: string }) => {
    const { Text } = require('react-native');
    return <Text>video-player:{source}</Text>;
  },
}));

const mockGetModule = jest.fn();
jest.mock('@/data/modules', () => ({
  ...jest.requireActual('@/data/modules'),
  getModule: (...args: unknown[]) => mockGetModule(...args),
}));

const mockGetLessonProgress = jest.fn();
jest.mock('@/data/lessons', () => ({
  getLessonProgress: (...args: unknown[]) => mockGetLessonProgress(...args),
}));

import '@/i18n';
import { useAppStore } from '@/store/useAppStore';

import ModuleScreen from '@/app/module/[id]';

const initialState = useAppStore.getState();

describe('ModuleScreen — overview video', () => {
  beforeEach(() => {
    useAppStore.setState(initialState, true);
    mockReplace.mockClear();
    mockPush.mockClear();
    mockGetModule.mockReset();
    mockGetLessonProgress.mockReturnValue([]);
    mockParams = { id: '02' };
  });

  it('renders no video player when the module has no overview video', async () => {
    mockGetModule.mockReturnValue({ id: '02', title: 'Online Scams', lessonCount: 9, minutes: 54 });
    const { queryByText } = await render(<ModuleScreen />);
    expect(queryByText(/video-player:/)).toBeNull();
  });

  it('renders the overview video above the lesson list when the module has one', async () => {
    mockGetModule.mockReturnValue({
      id: '02',
      title: 'Online Scams',
      lessonCount: 9,
      minutes: 54,
      overviewVideoUrl: 'https://cdn.example/overview.mp4',
    });
    const { getByText } = await render(<ModuleScreen />);
    expect(getByText('video-player:https://cdn.example/overview.mp4')).toBeTruthy();
  });
});
