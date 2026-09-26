import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost';

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <Text
        style={[
          styles.label,
          variant === 'primary' && styles.labelPrimary,
          variant !== 'primary' && styles.labelDefault,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    width: '100%',
  },
  primary: { backgroundColor: Colors.accent },
  secondary: { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.text },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.85 },
  label: { fontFamily: Fonts.bodyMedium, fontSize: 15, fontWeight: '700' },
  labelPrimary: { color: Colors.accentContrast },
  labelDefault: { color: Colors.text },
});
