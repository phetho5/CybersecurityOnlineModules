import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@/components/video-player', () => ({
  VideoPlayer: ({ source }: { source: string }) => {
    const { Text } = require('react-native');
    return <Text>video-player:{source}</Text>;
  },
}));

jest.mock('@/components/audio-player', () => ({
  AudioPlayer: ({ source, title }: { source: string; title?: string }) => {
    const { Text } = require('react-native');
    return <Text>audio-player:{source}:{title}</Text>;
  },
}));

import { TopicLesson } from '@/components/topic-lesson';
import { DIGITAL_PRIVACY_TRANSLATED_CONTENT } from '@/data/digital-privacy-topics';
import { POPIA_TRANSLATED_CONTENT } from '@/data/popia-topics';
import type { TopicContent } from '@/data/online-scams-topics';

const ungradedTopic: TopicContent = {
  n: 1,
  title: 'Introduction to Online Scams',
  intro: 'Online scams trick people into giving away money or information.',
  sections: [
    { heading: 'What Is an Online Scam?', body: 'A lead sentence.', items: ['Sending money.', 'Sharing personal information.'] },
    { heading: 'Warning Signs', items: ['Urgency', 'Suspicious links'] },
  ],
  example: 'STUDENT FUNDING NOTICE: URGENT: confirm your banking details within 30 minutes.',
  activity: {
    prompt: 'Activity: Spot the Scam',
    feedback: 'An unexpected financial offer combined with urgency should be verified independently.',
  },
  keyTakeaway: 'STOP → THINK → VERIFY',
};

const gradedTopic: TopicContent = {
  n: 5,
  title: 'How Scammers Manipulate Victims',
  intro: 'Scammers use social engineering.',
  sections: [{ heading: 'Common Manipulation Techniques', items: ['Urgency', 'Fear'] }],
  example: 'Your student account will be cancelled today unless you verify your information immediately.',
  activity: {
    prompt: 'Activity: Identify the Manipulation Technique',
    options: ['Reward', 'Fear and urgency', 'Curiosity', 'Entertainment'],
    correctIndex: 1,
    feedback: 'The message uses fear of cancellation and urgency to pressure the recipient.',
  },
  keyTakeaway: 'Scammers often manipulate emotions before asking victims to take an unsafe action.',
};

const capstoneTopic: TopicContent = {
  n: 9,
  title: 'Apply and Test Your Knowledge',
  intro: 'Apply what you have learned to unfamiliar situations.',
  sections: [],
  activity: { prompt: '', feedback: '' },
  scenarios: [
    { label: 'WhatsApp', text: 'Your R3,000 emergency payment has been approved.', tasks: ['Identify warning signs.', 'Select the safest response.'] },
    { label: 'SMS', text: 'Pay R20 delivery fee here: [link].', tasks: ['Investigate the message.'] },
  ],
  reflection: ['What warning sign did you identify first?'],
  keyTakeaway: 'RECOGNISE → INVESTIGATE → DECIDE → RESPOND',
};

const noActivityTopic: TopicContent = {
  n: 1,
  title: 'What is POPIA?',
  intro: 'Every day you share personal information online without even thinking about it.',
  sections: [{ heading: 'What Does POPIA Stand For?', items: ['POPIA stands for the Protection of Personal Information Act.'] }],
  example: 'Imagine you sign up for a new online shopping platform.',
  keyTakeaway: 'This is exactly the kind of situation POPIA was designed to prevent and to give you a way to act on.',
};

describe('TopicLesson', () => {
  it('renders title, sections, example and key takeaway without crashing when the topic has no activity', async () => {
    const { getByText, queryByText } = await render(<TopicLesson topic={noActivityTopic} />);
    expect(getByText(noActivityTopic.title)).toBeTruthy();
    expect(getByText('What Does POPIA Stand For?')).toBeTruthy();
    expect(getByText(noActivityTopic.example!)).toBeTruthy();
    expect(getByText(noActivityTopic.keyTakeaway)).toBeTruthy();
    expect(queryByText('✓')).toBeNull();
  });


  it('renders the title, intro, every section heading/body/items, the example, and the key takeaway', async () => {
    const { getByText } = await render(<TopicLesson topic={ungradedTopic} />);
    expect(getByText(ungradedTopic.title)).toBeTruthy();
    expect(getByText(ungradedTopic.intro)).toBeTruthy();
    expect(getByText('What Is an Online Scam?')).toBeTruthy();
    expect(getByText('A lead sentence.')).toBeTruthy();
    expect(getByText('Sending money.')).toBeTruthy();
    expect(getByText('Warning Signs')).toBeTruthy();
    expect(getByText('Suspicious links')).toBeTruthy();
    expect(getByText(ungradedTopic.example!)).toBeTruthy();
    expect(getByText(ungradedTopic.keyTakeaway)).toBeTruthy();
  });

  it('shows an ungraded activity’s feedback immediately, with no correct/incorrect marking', async () => {
    const { getByText, queryByText } = await render(<TopicLesson topic={ungradedTopic} />);
    expect(getByText(ungradedTopic.activity!.prompt)).toBeTruthy();
    expect(getByText(ungradedTopic.activity!.feedback)).toBeTruthy();
    expect(queryByText('✓')).toBeNull();
  });

  it('hides a graded activity’s feedback until an option is tapped', async () => {
    const { getByText, queryByText } = await render(<TopicLesson topic={gradedTopic} />);
    expect(getByText('Reward')).toBeTruthy();
    expect(queryByText(gradedTopic.activity!.feedback)).toBeNull();
  });

  it('reveals feedback and marks the correct option after the student taps any option', async () => {
    const { getByText } = await render(<TopicLesson topic={gradedTopic} />);
    await fireEvent.press(getByText('Reward'));
    expect(getByText(gradedTopic.activity!.feedback)).toBeTruthy();
  });

  it('ignores a second tap on a different option after the first answer is locked in (double-tap guard)', async () => {
    const onAnswered = jest.fn();
    const { getByText } = await render(<TopicLesson topic={gradedTopic} onActivityAnswered={onAnswered} />);
    await fireEvent.press(getByText('Reward'));
    await fireEvent.press(getByText('Fear and urgency'));
    expect(onAnswered).toHaveBeenCalledTimes(1);
  });

  it('renders the capstone scenarios and reflection prompts instead of an example/activity', async () => {
    const { getByText, queryByText } = await render(<TopicLesson topic={capstoneTopic} />);
    expect(getByText('WhatsApp')).toBeTruthy();
    expect(getByText('Your R3,000 emergency payment has been approved.')).toBeTruthy();
    expect(getByText('Identify warning signs.')).toBeTruthy();
    expect(getByText('SMS')).toBeTruthy();
    expect(getByText('What warning sign did you identify first?')).toBeTruthy();
    expect(queryByText(ungradedTopic.activity!.prompt)).toBeNull();
  });

  it('renders no video when videoUrl is not given', async () => {
    const { queryByText } = await render(<TopicLesson topic={ungradedTopic} />);
    expect(queryByText(/video-player:/)).toBeNull();
  });

  it('renders the video just above the key takeaway when videoUrl is given', async () => {
    const { getByText, toJSON } = await render(
      <TopicLesson topic={ungradedTopic} videoUrl="https://cdn.example/whatsapp-scam.mp4" />
    );
    expect(getByText('video-player:https://cdn.example/whatsapp-scam.mp4')).toBeTruthy();
    const serialized = JSON.stringify(toJSON());
    const videoIndex = serialized.indexOf('cdn.example/whatsapp-scam.mp4');
    const takeawayIndex = serialized.indexOf('Key takeaway');
    expect(videoIndex).toBeGreaterThan(-1);
    expect(takeawayIndex).toBeGreaterThan(-1);
    expect(videoIndex).toBeLessThan(takeawayIndex);
  });

  it('places the video just above the key takeaway for the capstone layout too', async () => {
    const { getByText, toJSON } = await render(
      <TopicLesson topic={capstoneTopic} videoUrl="https://cdn.example/avoid-scams.mp4" />
    );
    expect(getByText('video-player:https://cdn.example/avoid-scams.mp4')).toBeTruthy();
    const serialized = JSON.stringify(toJSON());
    const videoIndex = serialized.indexOf('cdn.example/avoid-scams.mp4');
    const takeawayIndex = serialized.indexOf('Key takeaway');
    expect(videoIndex).toBeLessThan(takeawayIndex);
  });

  it('renders no audio when audioUrl is not given', async () => {
    const { queryByText } = await render(<TopicLesson topic={ungradedTopic} />);
    expect(queryByText(/audio-player:/)).toBeNull();
  });

  it('renders the audio under the video, passing the topic title as playback metadata, both above the key takeaway', async () => {
    const { getByText, toJSON } = await render(
      <TopicLesson
        topic={ungradedTopic}
        videoUrl="https://cdn.example/whatsapp-scam.mp4"
        audioUrl="https://cdn.example/whatsapp-scam.mp3"
      />
    );
    expect(getByText(`audio-player:https://cdn.example/whatsapp-scam.mp3:${ungradedTopic.title}`)).toBeTruthy();
    const serialized = JSON.stringify(toJSON());
    const videoIndex = serialized.indexOf('cdn.example/whatsapp-scam.mp4');
    const audioIndex = serialized.indexOf('cdn.example/whatsapp-scam.mp3');
    const takeawayIndex = serialized.indexOf('Key takeaway');
    expect(videoIndex).toBeLessThan(audioIndex);
    expect(audioIndex).toBeLessThan(takeawayIndex);
  });

  it('still renders the audio above the key takeaway when there is no video', async () => {
    const { getByText } = await render(
      <TopicLesson topic={ungradedTopic} audioUrl="https://cdn.example/whatsapp-scam.mp3" />
    );
    expect(getByText(`audio-player:https://cdn.example/whatsapp-scam.mp3:${ungradedTopic.title}`)).toBeTruthy();
  });
});

describe('TopicLesson — translated POPIA and Digital Privacy topics', () => {
  const translated = [
    ...Object.entries(POPIA_TRANSLATED_CONTENT),
    ...Object.entries(DIGITAL_PRIVACY_TRANSLATED_CONTENT),
  ].flatMap(([lang, topics]) => (topics ?? []).map((topic) => [`${lang} — ${topic.title}`, topic] as const));

  it.each(translated)('renders the real translated lesson without crashing: %s', async (_label, topic) => {
    const { getAllByText } = await render(<TopicLesson topic={topic} />);
    expect(getAllByText(topic.title).length).toBeGreaterThan(0);
    expect(getAllByText(topic.intro).length).toBeGreaterThan(0);
    for (const section of topic.sections) {
      expect(getAllByText(section.heading).length).toBeGreaterThan(0);
    }
    expect(getAllByText(topic.keyTakeaway).length).toBeGreaterThan(0);
  });

  it('grades the isiZulu privacy-policy activity against the same answer as English, showing the isiZulu feedback', async () => {
    const topic = POPIA_TRANSLATED_CONTENT.zu![2];
    const { getByText, queryByText } = await render(<TopicLesson topic={topic} />);
    expect(queryByText(topic.activity!.feedback)).toBeNull();
    await fireEvent.press(getByText('Ingcaphuno B'));
    expect(getByText(topic.activity!.feedback)).toBeTruthy();
  });
});
