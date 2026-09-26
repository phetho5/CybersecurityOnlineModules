import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BadgeTile } from '@/components/badge-tile';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { BADGES } from '@/data/badges';
import { LANGUAGE_META, SUPPORTED_LANGUAGES, type LanguageCode } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const language = (useAppStore((s) => s.language) ?? 'en') as LanguageCode;
  const setLanguage = useAppStore((s) => s.setLanguage);
  const earnedBadgeIds = useAppStore((s) => s.earnedBadgeIds);

  const badges = BADGES.map((b) => ({ ...b, earned: earnedBadgeIds.includes(b.id) }));
  const rows: (typeof badges)[number][][] = [];
  for (let i = 0; i < badges.length; i += 3) rows.push(badges.slice(i, i + 3));

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.name}>Vhulenda Mashamba</Text>
          <Text style={styles.studentMeta}>u22554883 · BSc Computer Science</Text>
          <View style={styles.rule} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('badges')}</Text>
          {rows.map((row, i) => (
            <View key={i} style={styles.badgeRow}>
              {row.map((b) => (
                <BadgeTile key={b.id} badge={b} />
              ))}
              {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, j) => <View key={j} style={{ flex: 1 }} />)}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('certificate')}</Text>
          <View style={styles.certificateCard}>
            <Text style={styles.certKicker}>CyberAware SA</Text>
            <Text style={styles.certTitle}>Certificate of Completion</Text>
            <Text style={styles.certBody}>
              Awarded for passing the South African Online Scams track at 82%.
            </Text>
            <PrimaryButton label={t('download')} variant="secondary" onPress={() => {}} />
          </View>
        </View>

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
                    {selected ? 'Selected' : 'Switch'}
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  name: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 26, color: Colors.text },
  studentMeta: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginTop: 6,
  },
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
  badgeRow: { flexDirection: 'row', gap: Spacing.sm },
  certificateCard: {
    borderWidth: 2,
    borderColor: Colors.text,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  certKicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.accent700,
  },
  certTitle: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 18, color: Colors.text, marginTop: 4 },
  certBody: { fontFamily: Fonts.body, fontSize: 12, lineHeight: 18, color: Colors.neutral800, marginBottom: Spacing.xs },
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
