import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { Badge } from '@/data/badges';

/** A badge's medallion artwork. `dimmed` fades it for a badge the student has not earned yet. */
export function BadgeImage({ badge, size, dimmed = false }: { badge: Pick<Badge, 'id' | 'image'>; size: number; dimmed?: boolean }) {
  return (
    <Image
      testID={`badge-image-${badge.id}`}
      source={badge.image}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
      style={[{ width: size, height: size }, { opacity: dimmed ? 0.3 : 1 }]}
    />
  );
}

/** `onPress` only takes effect once the badge is earned: a locked badge is never a button. */
export function BadgeTile({ badge, onPress }: { badge: Badge; onPress?: () => void }) {
  const { t } = useTranslation();
  const name = t(`badgeName_${badge.id}`, { defaultValue: badge.name });
  const how = t(`badgeHow_${badge.id}`, { defaultValue: '' });
  const label = `${name}. ${badge.earned ? t('badgeEarned') : how}`;
  const content = (
    <>
      <BadgeImage badge={badge} size={88} dimmed={!badge.earned} />
      <Text style={[styles.name, !badge.earned && styles.nameLocked]}>{name}</Text>
      {!badge.earned && how !== '' && <Text style={styles.how}>{how}</Text>}
    </>
  );

  if (badge.earned && onPress) {
    return (
      <Pressable
        testID={`badge-tile-${badge.id}`}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }
  return (
    <View testID={`badge-tile-${badge.id}`} accessible accessibilityLabel={label} style={styles.tile}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xs },
  pressed: { opacity: 0.7 },
  name: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 13, textAlign: 'center', color: Colors.text },
  nameLocked: { color: Colors.textMuted },
  how: { fontFamily: Fonts.body, fontSize: 11, lineHeight: 15, textAlign: 'center', color: Colors.textMuted },
});
