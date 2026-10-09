import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';

export function AudioPlayer({ source, title }: { source: string; title?: string }) {
  const { t } = useTranslation();
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);

  function play() {
    // Surfaces lesson info on the lock screen / notification controls and keeps the OS from
    // treating this as a regular foreground-only sound, so playback survives leaving the app.
    player.setActiveForLockScreen(true, { title });
    player.play();
  }

  if (status.error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t('audioLoadError')}</Text>
      </View>
    );
  }

  if (status.isBuffering && !status.isLoaded) {
    return (
      <View style={styles.container} testID="audio-loading">
        <ActivityIndicator color={Colors.accent} />
        <Text style={styles.label}>{t('audioLoading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => (status.playing ? player.pause() : play())}
        style={styles.playButton}
        hitSlop={8}>
        <Icon name={status.playing ? 'pause' : 'play'} size={18} color={Colors.accentContrast} />
        <Text style={styles.playLabel}>{status.playing ? t('pauseAudio') : t('playAudio')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.text,
    borderRadius: Radii.sm,
    padding: Spacing.md,
    backgroundColor: Colors.neutral100,
  },
  label: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textMuted },
  errorText: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 19, color: Colors.accent700 },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.accent,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  playLabel: { fontFamily: Fonts.bodyMedium, fontSize: 13, fontWeight: '700', color: Colors.accentContrast },
});
