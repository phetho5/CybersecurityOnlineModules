import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BadgeTile } from '@/components/badge-tile';
import { CertificateSeal } from '@/components/certificate';
import { DailyReminder } from '@/components/daily-reminder';
import { Icon } from '@/components/icon';
import { NameForm } from '@/components/name-form';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { BADGES } from '@/data/badges';
import { LANGUAGE_META, SUPPORTED_LANGUAGES, type LanguageCode } from '@/i18n';
import { formatCertificateDate, listCertificates } from '@/lib/certificate';
import { readStudentName } from '@/lib/student-name';
import { useAppStore } from '@/store/useAppStore';

// Two across, so a how-to-earn line in any of the four languages has room under its badge.
const BADGES_PER_ROW = 2;

export default function ProfileScreen() {
  const { t } = useTranslation();
  const language = (useAppStore((s) => s.language) ?? 'en') as LanguageCode;
  const setLanguage = useAppStore((s) => s.setLanguage);
  const earnedBadgeIds = useAppStore((s) => s.earnedBadgeIds);
  const certificates = listCertificates(
    useAppStore((s) => s.certificates),
    earnedBadgeIds
  );

  const practiceStats = useAppStore((s) => s.practiceStats);
  const replayBadge = useAppStore((s) => s.replayBadge);
  const studentName = readStudentName(useAppStore((s) => s.studentName));
  const setStudentName = useAppStore((s) => s.setStudentName);
  const [editingName, setEditingName] = useState(false);

  const badges = BADGES.map((b) => ({ ...b, earned: earnedBadgeIds.includes(b.id) }));
  const earnedCount = badges.filter((b) => b.earned).length;
  const rows: (typeof badges)[number][][] = [];
  for (let i = 0; i < badges.length; i += BADGES_PER_ROW) rows.push(badges.slice(i, i + BADGES_PER_ROW));

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.name}>{t('profile')}</Text>
          <View style={styles.rule} />
        </View>

        <View style={styles.section} testID="profile-name-section">
          <Text style={styles.sectionTitle}>{t('yourName')}</Text>
          {editingName ? (
            <NameForm
              initialName={studentName ?? ''}
              help={t('nameHelp')}
              saveLabel={t('nameSave')}
              cancelLabel={t('cancel')}
              inputTestID="profile-name-input"
              onSave={(name) => {
                setStudentName(name);
                setEditingName(false);
              }}
              onCancel={() => setEditingName(false)}
            />
          ) : studentName ? (
            <>
              <Text testID="profile-name-value" style={styles.studentName}>
                {studentName}
              </Text>
              <Text style={styles.certBody}>{t('nameHelp')}</Text>
              <PrimaryButton label={t('certificateEditName')} variant="secondary" onPress={() => setEditingName(true)} />
            </>
          ) : (
            <>
              <Text style={styles.certBody}>{t('nameEmpty')}</Text>
              <PrimaryButton label={t('nameAdd')} variant="secondary" onPress={() => setEditingName(true)} />
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('badges')}</Text>
          <Text style={earnedCount === badges.length ? styles.badgesAllEarned : styles.certBody}>
            {earnedCount === badges.length
              ? t('badgesAllEarned')
              : t('badgesEarnedCount', { earned: earnedCount, total: badges.length })}
          </Text>
          {rows.map((row, i) => (
            <View key={i} style={styles.badgeRow}>
              {row.map((b) => (
                <BadgeTile key={b.id} badge={b} onPress={() => replayBadge(b.id)} />
              ))}
              {row.length < BADGES_PER_ROW &&
                Array.from({ length: BADGES_PER_ROW - row.length }).map((_, j) => <View key={j} style={{ flex: 1 }} />)}
            </View>
          ))}
        </View>

        <View style={styles.section} testID="practice-stats">
          <Text style={styles.sectionTitle}>{t('practice')}</Text>
          {practiceStats.answered === 0 && <Text style={styles.certBody}>{t('practiceStatsEmpty')}</Text>}
          <View style={styles.statsRow}>
            <PracticeStat testID="stat-days-practised" value={practiceStats.daysCompleted} label={t('statDaysPractised')} />
            <PracticeStat testID="stat-questions-answered" value={practiceStats.answered} label={t('statQuestionsAnswered')} />
            <PracticeStat testID="stat-correct-answers" value={practiceStats.correct} label={t('statCorrectAnswers')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('certificate')}</Text>
          {certificates.every((c) => !c.earned) && <Text style={styles.certBody}>{t('certificateEmpty')}</Text>}
          {certificates.map(({ moduleId, earned, record }) => {
            const moduleTitle = t(`moduleTitle_${moduleId}`);
            const date = formatCertificateDate(record?.awardedAt);
            return (
              <Pressable
                key={moduleId}
                testID={`certificate-row-${moduleId}`}
                accessibilityRole="button"
                onPress={() => router.push(earned ? `/certificate/${moduleId}` : `/module/${moduleId}`)}
                style={({ pressed }) => [styles.certificateRow, !earned && styles.certificateRowLocked, pressed && styles.pressed]}>
                <CertificateSeal size={40} dimmed={!earned} />
                <View style={styles.certificateText}>
                  <Text style={[styles.certTitle, !earned && styles.certTitleLocked]}>{moduleTitle}</Text>
                  <Text style={styles.certBody}>
                    {earned ? t('certificateBody', { module: moduleTitle }) : t('certificateLocked')}
                  </Text>
                  {date && <Text style={styles.certDate}>{date}</Text>}
                </View>
                <Icon name="chevron-forward" size={18} color={earned ? Colors.text : Colors.neutral500} />
              </Pressable>
            );
          })}
        </View>

        {/* Reminders cannot work in a web browser, so the whole section is left out there. */}
        {Platform.OS !== 'web' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('notifications')}</Text>
            <DailyReminder />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('language')}</Text>
          <View style={styles.langList}>
            {SUPPORTED_LANGUAGES.map((code) => {
              const selected = code === language;
              return (
                <Pressable
                  key={code}
                  onPress={() => setLanguage(code)}
                  style={[styles.langRow, selected && styles.langRowSelected]}>
                  <Text style={[styles.langName, selected && styles.langNameSelected]}>
                    {LANGUAGE_META[code].name}
                  </Text>
                  <Text style={[styles.langState, selected && styles.langNameSelected]}>
                    {selected ? t('languageSelected') : t('languageSwitch')}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PracticeStat({ value, label, testID }: { value: number; label: string; testID: string }) {
  return (
    <View style={styles.stat} testID={testID}>
      <Text style={styles.statValue}>{Number.isFinite(value) ? value : 0}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  name: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 26, color: Colors.text },
  rule: { height: 2, backgroundColor: Colors.text, marginTop: Spacing.md },
  section: { padding: Spacing.lg, borderBottomWidth: 2, borderBottomColor: Colors.divider, gap: Spacing.sm },
  sectionTitle: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.text,
  },
  studentName: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 20, lineHeight: 26, color: Colors.text },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  stat: { flex: 1 },
  statValue: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 26, color: Colors.text },
  statLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginTop: 4,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  badgesAllEarned: { fontFamily: Fonts.bodyMedium, fontSize: 13, lineHeight: 19, color: Colors.accent700 },
  certificateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 72,
    borderWidth: 2,
    borderColor: Colors.text,
    backgroundColor: Colors.paper,
    padding: Spacing.md,
  },
  certificateRowLocked: { borderColor: Colors.divider, borderStyle: 'dashed', backgroundColor: 'transparent' },
  certificateText: { flex: 1, gap: 2 },
  pressed: { opacity: 0.85 },
  certTitle: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 15, color: Colors.text },
  certTitleLocked: { color: Colors.textMuted },
  certBody: { fontFamily: Fonts.body, fontSize: 12, lineHeight: 18, color: Colors.neutral800 },
  certDate: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.6, color: Colors.textMuted },
  langList: { borderTopWidth: 2, borderTopColor: Colors.divider },
  langRow: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral300,
    paddingVertical: Spacing.md,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  langRowSelected: { backgroundColor: Colors.accent },
  langName: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 14, color: Colors.text },
  langNameSelected: { color: Colors.accentContrast },
  langState: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
});
