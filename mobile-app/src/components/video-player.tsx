import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';

export function VideoPlayer({ source }: { source: string }) {
  const [retryCount, setRetryCount] = useState(0);
  return <VideoPlayerInner key={retryCount} source={source} onRetry={() => setRetryCount((c) => c + 1)} />;
}

function VideoPlayerInner({ source, onRetry }: { source: string; onRetry: () => void }) {
  const { t } = useTranslation();
  const player = useVideoPlayer(source);
  const { status } = useEvent(player, 'statusChange', { status: player.status });

  return (
    <View style={styles.container}>
      <VideoView player={player} style={styles.video} nativeControls contentFit="contain" />
      {status === 'loading' && (
        <View style={styles.overlay} testID="video-loading">
          <ActivityIndicator color={Colors.background} />
        </View>
      )}
      {status === 'error' && (
        <View style={styles.overlay}>
          <Text style={styles.errorText}>{t('videoLoadError')}</Text>
          <Pressable onPress={onRetry} style={styles.retryButton} hitSlop={8}>
            <Text style={styles.retryText}>{t('retry')}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: Radii.sm,
    overflow: 'hidden',
    backgroundColor: Colors.text,
  },
  video: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  errorText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.background,
    textAlign: 'center',
  },
  retryButton: {
    borderWidth: 2,
    borderColor: Colors.background,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  retryText: { fontFamily: Fonts.bodyMedium, fontSize: 13, fontWeight: '700', color: Colors.background },
});
