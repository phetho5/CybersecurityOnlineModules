import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ProgressBar } from '@/components/progress-bar';
import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';
import type { ModuleDef } from '@/data/modules';

export function ModuleCard({
  module,
  pct,
  onPress,
}: {
  module: ModuleDef;
  pct: number;
  onPress: () => void;
}) {
  const complete = pct >= 100;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.numBadge}>
        <Text style={styles.numText}>{module.id}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {module.title}
        </Text>
        <Text style={styles.meta}>
          {module.lessonCount} lessons · {module.minutes} min
        </Text>
        <View style={styles.progressRow}>
          <ProgressBar pct={pct} />
          <Text style={styles.pctText}>{pct}%</Text>
        </View>
      </View>
      <Icon
        name={complete ? 'checkmark-circle' : 'chevron-forward'}
        size={20}
        color={complete ? Colors.success : Colors.neutral500}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.divider,
    padding: Spacing.md,
  },
  pressed: { opacity: 0.85 },
  numBadge: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    backgroundColor: Colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 13, color: Colors.text },
  body: { flex: 1, gap: 6 },
  title: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 15, color: Colors.text },
  meta: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMuted },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  pctText: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.textMuted, width: 32 },
});
