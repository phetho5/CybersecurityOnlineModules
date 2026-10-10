import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccessibilityInfo,
  Animated,
  BackHandler,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BadgeImage } from '@/components/badge-tile';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { getBadge, type Badge } from '@/data/badges';
import { useAppStore } from '@/store/useAppStore';

const BADGE_SIZE = 168;
const SPARKLE_COUNT = 12;
const RAY_COUNT = 12;
// How far the sparkles fly out from the middle of the badge.
const SPARKLE_REACH = 150;
// Animations run on the native thread on a phone; a browser has no such thread.
const NATIVE = Platform.OS !== 'web';

// One animated value that lasts as long as the component. (React Native's own `useAnimatedValue`
// does not exist in the web build of the app, where using it crashes the screen.)
const useValue = () => useState(() => new Animated.Value(0))[0];

/**
 * Celebrates a badge the student has just earned: it takes over the middle of the screen, on top
 * of whatever they were doing, and stays until they close it. Several badges earned at once are
 * celebrated one after the other. Tapping an earned badge on Profile plays the same celebration
 * again; a newly earned badge always goes first.
 */
export function BadgeCelebration() {
  const earnedId = useAppStore((s) => s.badgeAnnouncements[0]);
  const replayId = useAppStore((s) => s.badgeReplayId);
  const dismissEarned = useAppStore((s) => s.dismissBadgeAnnouncement);
  const closeReplay = useAppStore((s) => s.closeBadgeReplay);

  const replaying = earnedId === undefined && replayId !== null;
  const badgeId = replaying ? replayId : earnedId;
  const dismiss = replaying ? closeReplay : dismissEarned;
  const badge = getBadge(badgeId);

  useEffect(() => {
    // An id with no badge behind it has nothing to show: drop it so the next one is not stuck.
    if (badgeId !== undefined && badgeId !== null && !badge) dismiss();
  }, [badgeId, badge, dismiss]);

  // The Android back button closes the celebration rather than the screen underneath it.
  const showing = Boolean(badge);
  useEffect(() => {
    if (!showing) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      dismiss();
      return true;
    });
    return () => subscription.remove();
  }, [showing, dismiss]);

  if (!badge) return null;
  // Keyed by badge so each one gets its own entrance instead of the picture just changing.
  return <Celebration key={`${replaying ? 'replay' : 'earned'}-${badge.id}`} badge={badge} replay={replaying} onClose={dismiss} />;
}

function Celebration({ badge, replay, onClose }: { badge: Badge; replay: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const closed = useRef(false);

  // Each value runs from 0 (not yet arrived) to 1 (in place).
  const backdrop = useValue();
  const pop = useValue();
  const spin = useValue();
  const burst = useValue();
  const burstLate = useValue();
  const sparkle = useValue();
  const words = useValue();
  const actions = useValue();
  // These two keep going for as long as the celebration is up.
  const pulse = useValue();
  const rays = useValue();

  useEffect(() => {
    let cancelled = false;
    const running: Animated.CompositeAnimation[] = [];
    const timing = (value: Animated.Value, duration: number, delay = 0, easing = Easing.out(Easing.cubic)) =>
      Animated.timing(value, { toValue: 1, duration, delay, easing, useNativeDriver: NATIVE });

    function play() {
      const entrance = Animated.parallel([
        timing(backdrop, 260),
        Animated.spring(pop, { toValue: 1, friction: 4, tension: 55, delay: 120, useNativeDriver: NATIVE }),
        timing(spin, 800, 120, Easing.out(Easing.back(1.4))),
        timing(burst, 950, 220),
        timing(burstLate, 950, 480),
        timing(sparkle, 1000, 260),
        timing(words, 380, 620),
        timing(actions, 320, 900),
      ]);
      const breathing = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: NATIVE }),
          Animated.timing(pulse, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: NATIVE }),
        ])
      );
      const turning = Animated.loop(
        Animated.timing(rays, { toValue: 1, duration: 16000, easing: Easing.linear, useNativeDriver: NATIVE })
      );
      running.push(entrance, breathing, turning);
      running.forEach((animation) => animation.start());
    }

    // A student who has asked their phone for less motion gets the badge in place, with no movement.
    function showStill() {
      [backdrop, pop, spin, words, actions].forEach((value) => value.setValue(1));
    }

    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduceMotion) => {
        if (cancelled) return;
        if (reduceMotion) showStill();
        else play();
      });

    return () => {
      cancelled = true;
      running.forEach((animation) => animation.stop());
    };
    // The values are created once per celebration and never change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function close(then?: () => void) {
    if (closed.current) return;
    closed.current = true;
    onClose();
    then?.();
  }

  const ring = (value: Animated.Value) => ({
    opacity: value.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.75, 0] }),
    transform: [{ scale: value.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.6] }) }],
  });

  return (
    <View
      testID="badge-celebration"
      accessibilityViewIsModal
      accessibilityLiveRegion="assertive"
      style={styles.overlay}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdrop }]} />

      <View style={styles.stage}>
        <Animated.View
          testID="badge-celebration-burst"
          pointerEvents="none"
          style={[
            styles.rays,
            {
              opacity: pop.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolate: 'clamp' }),
              transform: [{ rotate: rays.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
            },
          ]}>
          {Array.from({ length: RAY_COUNT }, (_, i) => (
            <View key={i} style={[styles.ray, { transform: [{ rotate: `${(360 / RAY_COUNT) * i}deg` }] }]} />
          ))}
        </Animated.View>

        <Animated.View pointerEvents="none" style={[styles.ring, ring(burst)]} />
        <Animated.View pointerEvents="none" style={[styles.ring, ring(burstLate)]} />

        {Array.from({ length: SPARKLE_COUNT }, (_, i) => {
          const angle = (2 * Math.PI * i) / SPARKLE_COUNT;
          // Alternate sparkles stop short, so they scatter rather than forming one neat circle.
          const reach = SPARKLE_REACH * (i % 2 === 0 ? 1 : 0.7);
          return (
            <Animated.View
              key={i}
              testID="badge-celebration-sparkle"
              pointerEvents="none"
              style={[
                styles.sparkle,
                i % 3 === 0 && styles.sparkleLight,
                {
                  opacity: sparkle.interpolate({ inputRange: [0, 0.1, 0.75, 1], outputRange: [0, 1, 1, 0] }),
                  transform: [
                    { translateX: sparkle.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(angle) * reach] }) },
                    { translateY: sparkle.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(angle) * reach] }) },
                    { scale: sparkle.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.2, 1.3, 0.5] }) },
                  ],
                },
              ]}
            />
          );
        })}

        <Animated.View
          style={{
            opacity: pop.interpolate({ inputRange: [0, 0.3], outputRange: [0, 1], extrapolate: 'clamp' }),
            transform: [
              { scale: pop },
              { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) },
              { rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['-200deg', '0deg'] }) },
            ],
          }}>
          <BadgeImage badge={badge} size={BADGE_SIZE} />
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.words,
          { opacity: words, transform: [{ translateY: words.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }] },
        ]}>
        <Text style={styles.kicker}>{t('badgeEarned')}</Text>
        <Text style={styles.name}>{t(`badgeName_${badge.id}`, { defaultValue: badge.name })}</Text>
        <Text style={styles.congrats}>{t('badgeCongrats')}</Text>
      </Animated.View>

      <Animated.View style={[styles.actions, { opacity: actions }]}>
        {replay ? (
          // Replayed from Profile: the student is already at their badges, so there is one way out.
          <PrimaryButton label={t('back')} onPress={() => close()} />
        ) : (
          <>
            <PrimaryButton label={t('badgeSeeMine')} onPress={() => close(() => router.push('/(tabs)/profile'))} />
            <Pressable accessibilityRole="button" hitSlop={8} style={styles.keepGoing} onPress={() => close()}>
              <Text style={styles.keepGoingText}>{t('badgeKeepGoing')}</Text>
            </Pressable>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    // The burst and rays reach past the edges of a small screen; they must not make it scroll.
    overflow: 'hidden',
    zIndex: 20,
    elevation: 20,
  },
  backdrop: { backgroundColor: 'rgba(24, 14, 12, 0.96)' },
  stage: { width: BADGE_SIZE, height: BADGE_SIZE, alignItems: 'center', justifyContent: 'center' },
  rays: { position: 'absolute', width: 1, height: 1, alignItems: 'center', justifyContent: 'center' },
  ray: { position: 'absolute', width: 6, height: 340, borderRadius: 3, backgroundColor: 'rgba(255, 214, 153, 0.13)' },
  ring: {
    position: 'absolute',
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    borderWidth: 4,
    borderColor: Colors.accent,
  },
  sparkle: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.accent },
  sparkleLight: { backgroundColor: '#ffd699' },
  words: { alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.xl, maxWidth: MaxContentWidth },
  kicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#ffd699',
  },
  name: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 30,
    lineHeight: 36,
    textAlign: 'center',
    color: Colors.accentContrast,
  },
  congrats: { fontFamily: Fonts.body, fontSize: 15, lineHeight: 21, textAlign: 'center', color: Colors.accentContrast, opacity: 0.9 },
  actions: { alignSelf: 'stretch', alignItems: 'stretch', gap: Spacing.sm, marginTop: Spacing.xl, maxWidth: MaxContentWidth },
  keepGoing: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  keepGoingText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accentContrast,
    textDecorationLine: 'underline',
  },
});
