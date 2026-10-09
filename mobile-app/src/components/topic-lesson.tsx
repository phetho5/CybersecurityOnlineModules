import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AudioPlayer } from '@/components/audio-player';
import { Icon } from '@/components/icon';
import { VideoPlayer } from '@/components/video-player';
import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';
import type { TopicContent } from '@/data/online-scams-topics';

export function TopicLesson({
  topic,
  videoUrl,
  audioUrl,
  onActivityAnswered,
}: {
  topic: TopicContent;
  /** Shown just above the key takeaway, when this topic has a real, sourced video. */
  videoUrl?: string;
  /** Shown just under the video (or in its place, if there is none), above the key takeaway. */
  audioUrl?: string;
  /** Called once, the first time the student answers a graded activity. */
  onActivityAnswered?: (correct: boolean) => void;
}) {
  const { t } = useTranslation();
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);
  const isGraded = topic.activity?.correctIndex !== undefined;
  const isCapstone = Boolean(topic.scenarios);
  // An ungraded activity's feedback is informational, not a reward for answering, so show it
  // immediately; a graded one only reveals feedback once the student has actually answered.
  const showFeedback = !isGraded || pickedIndex !== null;

  function pick(index: number) {
    if (pickedIndex !== null) return;
    setPickedIndex(index);
    if (isGraded) {
      onActivityAnswered?.(index === topic.activity?.correctIndex);
    }
  }

  return (
    <View>
      <Text style={styles.title}>{topic.title}</Text>
      <Text style={styles.intro}>{topic.intro}</Text>

      {topic.sections.map((section) => (
        <View key={section.heading} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.heading}</Text>
          {section.body && <Text style={styles.sectionBody}>{section.body}</Text>}
          {section.items.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <Text style={styles.bulletMark}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      ))}

      {isCapstone ? (
        <>
          {topic.scenarios!.map((scenario) => (
            <View key={scenario.label} style={styles.card}>
              <Text style={styles.cardKicker}>{scenario.label}</Text>
              {scenario.text.length > 0 && <Text style={styles.cardBody}>{scenario.text}</Text>}
              {scenario.tasks.map((task) => (
                <View key={task} style={styles.bulletRow}>
                  <Text style={styles.bulletMark}>•</Text>
                  <Text style={styles.bulletText}>{task}</Text>
                </View>
              ))}
            </View>
          ))}
          {topic.reflection && topic.reflection.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>{t('reflection')}</Text>
              {topic.reflection.map((question) => (
                <View key={question} style={styles.bulletRow}>
                  <Text style={styles.bulletMark}>•</Text>
                  <Text style={styles.bulletText}>{question}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      ) : (
        <>
          {topic.example && (
            <View style={styles.card}>
              <Text style={styles.cardKicker}>{t('example')}</Text>
              <Text style={styles.cardBody}>{topic.example}</Text>
            </View>
          )}

          {topic.activity && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>{topic.activity.prompt}</Text>
              {topic.activity.options?.map((option, i) => {
                let bg: string = 'transparent';
                let fg: string = Colors.text;
                let mark = '';
                if (isGraded && pickedIndex !== null) {
                  if (i === topic.activity!.correctIndex) {
                    bg = Colors.accent;
                    fg = Colors.accentContrast;
                    mark = '✓';
                  } else if (i === pickedIndex) {
                    bg = Colors.neutral300;
                    mark = '✕';
                  }
                }
                return (
                  <Pressable
                    key={option}
                    disabled={!isGraded || pickedIndex !== null}
                    onPress={() => pick(i)}
                    style={[styles.optionRow, { backgroundColor: bg }]}>
                    <Text style={[styles.optionKey, { color: fg }]}>{'ABCD'[i]}</Text>
                    <Text style={[styles.optionText, { color: fg }]}>{option}</Text>
                    {mark ? <Icon name={mark === '✓' ? 'checkmark' : 'close'} size={14} color={fg} /> : null}
                  </Pressable>
                );
              })}
              {showFeedback && topic.activity.feedback.length > 0 && (
                <View style={styles.feedback}>
                  <Text style={styles.feedbackBody}>{topic.activity.feedback}</Text>
                </View>
              )}
            </View>
          )}
        </>
      )}

      {videoUrl && (
        <View style={styles.videoWrap}>
          <VideoPlayer source={videoUrl} />
        </View>
      )}

      {audioUrl && (
        <View style={styles.videoWrap}>
          <AudioPlayer source={audioUrl} title={topic.title} />
        </View>
      )}

      <View style={styles.takeawayCard}>
        <Text style={styles.takeawayKicker}>{t('keyTakeaway')}</Text>
        <Text style={styles.takeawayBody}>{topic.keyTakeaway}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 24, lineHeight: 29, color: Colors.text, paddingHorizontal: Spacing.lg },
  intro: { fontFamily: Fonts.body, fontSize: 14, lineHeight: 21, color: Colors.text, padding: Spacing.lg, paddingTop: Spacing.sm },
  section: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, gap: 4 },
  sectionHeading: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 15, color: Colors.text, marginBottom: 4 },
  sectionBody: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 19, color: Colors.neutral800, marginBottom: 4 },
  bulletRow: { flexDirection: 'row', gap: Spacing.xs, paddingVertical: 2 },
  bulletMark: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textMuted },
  bulletText: { flex: 1, fontFamily: Fonts.body, fontSize: 13, lineHeight: 19, color: Colors.text },
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.text,
    backgroundColor: Colors.neutral100,
    borderRadius: Radii.sm,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  cardKicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.accent700,
  },
  cardBody: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 20, color: Colors.text },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral300,
  },
  optionKey: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 13 },
  optionText: { flex: 1, fontFamily: Fonts.body, fontSize: 13, lineHeight: 19 },
  feedback: { marginTop: Spacing.sm, borderWidth: 2, borderColor: Colors.text, backgroundColor: Colors.neutral100, padding: Spacing.md, borderRadius: Radii.sm },
  feedbackBody: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 20, color: Colors.text },
  videoWrap: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  takeawayCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.accent,
    backgroundColor: Colors.accent100,
    borderRadius: Radii.sm,
    padding: Spacing.md,
    gap: 4,
  },
  takeawayKicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.accent700,
  },
  takeawayBody: { fontFamily: Fonts.heading, fontWeight: '700', fontSize: 14, lineHeight: 20, color: Colors.text },
});
