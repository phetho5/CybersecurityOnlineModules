import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams: { moduleId: string; lessonN: string } = { moduleId: '01', lessonN: '1' };

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

jest.mock('@/components/audio-player', () => ({
  AudioPlayer: ({ source }: { source: string }) => {
    const { Text } = require('react-native');
    return <Text>audio-player:{source}</Text>;
  },
}));

const mockGetLesson = jest.fn();
jest.mock('@/data/lessons', () => ({
  getLesson: (...args: unknown[]) => mockGetLesson(...args),
}));

const mockGetModuleTopicContent = jest.fn();
jest.mock('@/lib/topic-source', () => ({
  getModuleTopicContent: (...args: unknown[]) => mockGetModuleTopicContent(...args),
}));

import '@/i18n';
import { TOPIC_CONTENT } from '@/data/online-scams-topics';
import { useAppStore } from '@/store/useAppStore';

import LessonScreen from '@/app/lesson/[moduleId]/[lessonN]';

const initialState = useAppStore.getState();

describe('LessonScreen — module with no matching topic source: graceful not-found', () => {
  beforeEach(() => {
    useAppStore.setState(initialState, true);
    mockPush.mockClear();
    mockReplace.mockClear();
    mockGetLesson.mockReset();
    mockGetModuleTopicContent.mockReset();
    mockParams = { moduleId: '01', lessonN: '1' };
  });

  it('shows a graceful not-found state instead of crashing for an invalid lesson', async () => {
    mockGetLesson.mockReturnValue(undefined);
    mockGetModuleTopicContent.mockReturnValue(undefined);
    const { getByText } = await render(<LessonScreen />);
    expect(getByText(/lesson not found/i)).toBeTruthy();
  });

  it('shows a graceful not-found state when the lesson exists but no topic content resolves for it', async () => {
    mockGetLesson.mockReturnValue({ n: 1, title: 'What is POPIA?', minutes: 4 });
    mockGetModuleTopicContent.mockReturnValue(undefined);
    const { getByText } = await render(<LessonScreen />);
    expect(getByText(/lesson not found/i)).toBeTruthy();
  });
});

describe('LessonScreen — module 02 (Online Scams): sourced topic content, per-lesson knowledge check', () => {
  beforeEach(() => {
    useAppStore.setState(initialState, true);
    mockPush.mockClear();
    mockReplace.mockClear();
    mockGetLesson.mockReset();
    mockGetModuleTopicContent.mockReset();
    mockGetModuleTopicContent.mockImplementation((_moduleId: string, _lang: string, n: number) => TOPIC_CONTENT.en[n - 1]);
    mockParams = { moduleId: '02', lessonN: '1' };
  });

  it('renders the sourced topic content (title, intro, a section, the example) for lesson 1, with no video player when none is set', async () => {
    mockGetLesson.mockReturnValue({ n: 1, title: TOPIC_CONTENT.en[0].title, minutes: 4 });
    const { getByText, queryByText } = await render(<LessonScreen />);
    const topic = TOPIC_CONTENT.en[0];
    expect(getByText(topic.title)).toBeTruthy();
    expect(getByText(topic.intro)).toBeTruthy();
    expect(getByText(topic.sections[0].heading)).toBeTruthy();
    expect(getByText(topic.example!)).toBeTruthy();
    expect(queryByText(/video-player:/)).toBeNull();
  });

  it('renders the video player within the sourced topic content when the lesson has a video', async () => {
    mockGetLesson.mockReturnValue({
      n: 1,
      title: TOPIC_CONTENT.en[0].title,
      minutes: 4,
      videoUrl: 'https://cdn.example/topic1.mp4',
    });
    const { getByText } = await render(<LessonScreen />);
    expect(getByText('video-player:https://cdn.example/topic1.mp4')).toBeTruthy();
    expect(getByText(TOPIC_CONTENT.en[0].title)).toBeTruthy();
    expect(getByText(TOPIC_CONTENT.en[0].intro)).toBeTruthy();
  });

  it('renders the audio player within the sourced topic content when the lesson has audio', async () => {
    mockGetLesson.mockReturnValue({
      n: 1,
      title: TOPIC_CONTENT.en[0].title,
      minutes: 4,
      audioUrl: 'https://cdn.example/topic1.mp3',
    });
    const { getByText } = await render(<LessonScreen />);
    expect(getByText('audio-player:https://cdn.example/topic1.mp3')).toBeTruthy();
  });

  it('remembers this lesson as where the student left off, for "Continue learning"', async () => {
    mockGetLesson.mockReturnValue({ n: 4, title: TOPIC_CONTENT.en[3].title, minutes: 4 });
    mockParams = { moduleId: '02', lessonN: '4' };
    await render(<LessonScreen />);
    expect(useAppStore.getState().lastLesson).toEqual({ moduleId: '02', lessonN: 4 });
  });

  it('does not record a lesson that could not be found as where the student left off', async () => {
    useAppStore.getState().setLastLesson('01', 2);
    mockGetLesson.mockReturnValue(undefined);
    mockGetModuleTopicContent.mockReturnValue(undefined);
    mockParams = { moduleId: '02', lessonN: '77' };
    await render(<LessonScreen />);
    expect(useAppStore.getState().lastLesson).toEqual({ moduleId: '01', lessonN: 2 });
  });

  it('shows "Start knowledge check" instead of "Next lesson", and routes to that lesson\'s own quiz', async () => {
    mockGetLesson.mockReturnValue({ n: 1, title: TOPIC_CONTENT.en[0].title, minutes: 4 });
    const { getByText, queryByText } = await render(<LessonScreen />);
    expect(queryByText(/next lesson/i)).toBeNull();
    expect(queryByText(/take the assessment/i)).toBeNull();
    await fireEvent.press(getByText(/start knowledge check/i));
    expect(mockPush).toHaveBeenCalledWith('/quiz/02/1');
  });

  it('renders the capstone (lesson 9) scenarios instead of a single example/activity', async () => {
    mockGetLesson.mockReturnValue({ n: 9, title: TOPIC_CONTENT.en[8].title, minutes: 8 });
    mockParams = { moduleId: '02', lessonN: '9' };
    const { getByText } = await render(<LessonScreen />);
    expect(getByText(TOPIC_CONTENT.en[8].scenarios![0].label)).toBeTruthy();
    expect(getByText(TOPIC_CONTENT.en[8].reflection![0])).toBeTruthy();
  });
});

describe('LessonScreen — modules 01 (POPIA) and 03 (Digital Privacy): also use sourced topic content', () => {
  beforeEach(() => {
    useAppStore.setState(initialState, true);
    mockPush.mockClear();
    mockReplace.mockClear();
    mockGetLesson.mockReset();
    mockGetModuleTopicContent.mockReset();
  });

  it('renders POPIA topic content for lesson 1 and routes its knowledge check to /quiz/01/1', async () => {
    const topic = {
      n: 1,
      title: 'What is POPIA?',
      intro: 'Every day you share personal information online without even thinking about it.',
      sections: [{ heading: 'What Does POPIA Stand For?', items: ['POPIA stands for the Protection of Personal Information Act.'] }],
      keyTakeaway: 'This is exactly the kind of situation POPIA was designed to prevent.',
    };
    mockGetModuleTopicContent.mockReturnValue(topic);
    mockGetLesson.mockReturnValue({ n: 1, title: topic.title, minutes: 4 });
    mockParams = { moduleId: '01', lessonN: '1' };
    const { getByText } = await render(<LessonScreen />);
    expect(getByText(topic.title)).toBeTruthy();
    await fireEvent.press(getByText(/start knowledge check/i));
    expect(mockPush).toHaveBeenCalledWith('/quiz/01/1');
  });

  it('renders Digital Privacy topic content for lesson 2 and routes its knowledge check to /quiz/03/2', async () => {
    const topic = {
      n: 2,
      title: 'Protecting Your Digital Privacy',
      intro: 'This final topic brings everything together.',
      sections: [{ heading: 'Practical Steps', items: ['Think before you share.'] }],
      keyTakeaway: 'Small consistent changes make a big difference over time.',
    };
    mockGetModuleTopicContent.mockReturnValue(topic);
    mockGetLesson.mockReturnValue({ n: 2, title: topic.title, minutes: 6 });
    mockParams = { moduleId: '03', lessonN: '2' };
    const { getByText } = await render(<LessonScreen />);
    expect(getByText(topic.title)).toBeTruthy();
    await fireEvent.press(getByText(/start knowledge check/i));
    expect(mockPush).toHaveBeenCalledWith('/quiz/03/2');
  });
});
