import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ModuleCard } from '@/components/module-card';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { MODULES } from '@/data/modules';
import { useAppStore } from '@/store/useAppStore';

export default function ModulesScreen() {
  const { t } = useTranslation();
  const moduleProgress = useAppStore((s) => s.moduleProgress);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('modules')}</Text>
        <Text style={styles.subtitle}>South African-context cybersecurity tracks, in your language.</Text>
      </View>
      <View style={styles.rule} />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {MODULES.map((m) => (
          <ModuleCard
            key={m.id}
            module={m}
            pct={moduleProgress[m.id] ?? 0}
            onPress={() => router.push(`/module/${m.id}`)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: 6 },
  title: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.text,
  },
  subtitle: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textMuted },
  rule: { height: 2, backgroundColor: Colors.divider, marginTop: Spacing.md },
  list: { padding: Spacing.lg, gap: Spacing.sm },
});
