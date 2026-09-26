import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import { LANGUAGE_META, SUPPORTED_LANGUAGES, type LanguageCode } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

export default function LanguageScreen() {
  const setLanguage = useAppStore((s) => s.setLanguage);

  function choose(code: LanguageCode) {
    setLanguage(code);
    router.replace('/(tabs)/home');
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.kicker}>CyberAware SA</Text>
        <View style={styles.rule} />
        <Text style={styles.heading}>Choose your learning language</Text>
        <Text style={styles.subtitle}>
          Khetha ulimi lwakho lokufunda · Kgetha polelo ya gago · Hlawula ririmi ra wena
        </Text>
        <View style={styles.divider} />

        {SUPPORTED_LANGUAGES.map((code) => (
          <Pressable
            key={code}
            onPress={() => choose(code)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
            <Text style={styles.langName}>{LANGUAGE_META[code].name}</Text>
            <Text style={styles.langNote}>{LANGUAGE_META[code].note}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  kicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.accent700,
  },
  rule: { height: 2, backgroundColor: Colors.text, marginVertical: Spacing.md },
  heading: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 32, lineHeight: 36, color: Colors.text },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  divider: { height: 2, backgroundColor: Colors.divider, marginTop: Spacing.lg },
  row: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.divider,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  rowPressed: { backgroundColor: Colors.accent100 },
  langName: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 20, color: Colors.text },
  langNote: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
});
