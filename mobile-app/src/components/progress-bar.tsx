import { StyleSheet, View } from 'react-native';

import { Colors, Radii } from '@/constants/theme';

export function ProgressBar({ pct, height = 4 }: { pct: number; height?: number }) {
  return (
    <View style={[styles.track, { height }]}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, pct))}%`, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: Colors.neutral300, borderRadius: Radii.pill, overflow: 'hidden', width: '100%' },
  fill: { backgroundColor: Colors.accent, borderRadius: Radii.pill },
});
