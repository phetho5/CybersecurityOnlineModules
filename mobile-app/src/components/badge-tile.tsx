import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';
import type { Badge } from '@/data/badges';

export function BadgeTile({ badge }: { badge: Badge }) {
  return (
    <View style={[styles.tile, { opacity: badge.earned ? 1 : 0.38 }]}>
      <View style={[styles.iconWrap, badge.earned && styles.iconWrapEarned]}>
        <Icon name={badge.icon} size={22} color={badge.earned ? Colors.accent700 : Colors.neutral600} />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {badge.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, alignItems: 'center', gap: Spacing.xs, padding: Spacing.sm },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: Radii.pill,
    backgroundColor: Colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapEarned: { backgroundColor: Colors.accent100 },
  name: { fontFamily: Fonts.bodyMedium, fontSize: 11, textAlign: 'center', color: Colors.text },
});
