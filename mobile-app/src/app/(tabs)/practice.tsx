import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DailyPractice } from '@/components/daily-practice';
import { Icon } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';
import {
  checkMessage,
  checkScreenshot,
  MESSAGE_CHECK_MAX_LENGTH,
  validateScreenshot,
  type CheckMessageResult,
  type DeepSeekErrorReason,
} from '@/lib/deepseek';
import { pickScreenshot, type PickedScreenshot } from '@/lib/pick-screenshot';
import type { LanguageCode } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

type CheckSuccess = Extract<CheckMessageResult, { ok: true }>;

// How long a check may run before the waiting text changes, so a slow upload still feels alive.
const SLOW_CHECK_MS = 5000;

function errorKey(reason: DeepSeekErrorReason): string {
  switch (reason) {
    case 'missing-key':
      return 'aiErrorMissingKey';
    case 'invalid-input':
      return 'aiErrorInvalidInput';
    case 'invalid-key':
      return 'aiErrorInvalidKey';
    case 'rate-limited':
      return 'aiErrorRateLimited';
    case 'network':
      return 'aiErrorNetwork';
    case 'invalid-response':
      return 'aiErrorInvalidResponse';
    case 'image-too-large':
      return 'aiErrorImageTooLarge';
    case 'unsupported-image':
      return 'aiErrorUnsupportedImage';
    case 'no-text-found':
      return 'aiErrorNoTextFound';
    default:
      return 'aiErrorUnexpected';
  }
}

export default function PracticeScreen() {
  const { t } = useTranslation();
  const language = (useAppStore((s) => s.language) ?? 'en') as LanguageCode;

  const [message, setMessage] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckSuccess | null>(null);
  const [checkError, setCheckError] = useState<DeepSeekErrorReason | null>(null);
  const checkInFlight = useRef(false);
  const [slowCheck, setSlowCheck] = useState(false);

  // A screenshot, once attached, takes the place of the text box until it is removed.
  const [screenshot, setScreenshot] = useState<PickedScreenshot | null>(null);
  const [pickErrorKey, setPickErrorKey] = useState<string | null>(null);
  const pickInFlight = useRef(false);

  const trimmedMessage = message.trim();
  const overLimit = message.length > MESSAGE_CHECK_MAX_LENGTH;
  const canSubmit = screenshot !== null || (trimmedMessage.length > 0 && !overLimit);

  async function runCheck() {
    if (checkInFlight.current) return;
    checkInFlight.current = true;
    setChecking(true);
    setCheckError(null);
    setSlowCheck(false);
    const slowTimer = setTimeout(() => setSlowCheck(true), SLOW_CHECK_MS);

    const result = screenshot
      ? await checkScreenshot({ base64: screenshot.base64, mimeType: screenshot.mimeType }, language)
      : await checkMessage(trimmedMessage, language);
    clearTimeout(slowTimer);
    if (result.ok) {
      setCheckResult(result);
      setCheckError(null);
    } else {
      setCheckResult(null);
      setCheckError(result.error);
    }

    setChecking(false);
    checkInFlight.current = false;
  }

  async function addScreenshot() {
    if (pickInFlight.current || checkInFlight.current) return;
    pickInFlight.current = true;

    const picked = await pickScreenshot();
    pickInFlight.current = false;
    // Closing the picker without choosing is not an error: leave everything as it was.
    if (!picked.ok && picked.reason === 'cancelled') return;

    if (!picked.ok) {
      setPickErrorKey('screenshotPickFailed');
      return;
    }
    // Catch a picture the AI can't take here, rather than after the student presses Check.
    const rejection = validateScreenshot(picked.screenshot);
    if (rejection) {
      setPickErrorKey(errorKey(rejection));
      return;
    }
    setPickErrorKey(null);
    setScreenshot(picked.screenshot);
    setCheckResult(null);
    setCheckError(null);
  }

  function removeScreenshot() {
    if (checkInFlight.current) return;
    setScreenshot(null);
    setCheckResult(null);
    setCheckError(null);
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('practice')}</Text>
          <Text style={styles.subtitle}>{t('practiceSubtitle')}</Text>
          <View style={styles.rule} />
        </View>

        <DailyPractice />

        <View style={styles.aiSection}>
          <Text style={styles.aiKicker}>{t('aiTutor')}</Text>
          {screenshot ? (
            <View style={styles.previewWrap}>
              <Image
                testID="screenshot-preview"
                source={{ uri: screenshot.uri }}
                style={styles.preview}
                resizeMode="contain"
                accessibilityLabel={t('screenshotPreviewLabel')}
              />
              <Pressable onPress={removeScreenshot} disabled={checking} style={styles.retryButton} hitSlop={8}>
                <Text style={styles.retryText}>{t('removeScreenshot')}</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={[styles.inputRow, overLimit && styles.inputRowError]}>
                <Icon name="chatbox-ellipses-outline" size={18} color={Colors.textMuted} />
                <TextInput
                  placeholder={t('messageCheckPlaceholder')}
                  placeholderTextColor={Colors.textMuted}
                  style={styles.input}
                  multiline
                  value={message}
                  onChangeText={(text) => {
                    setMessage(text);
                    setCheckResult(null);
                    setCheckError(null);
                  }}
                />
              </View>
              <View style={styles.counterRow}>
                {overLimit && <Text style={styles.errorText}>{t('messageTooLong')}</Text>}
                <Text style={[styles.counter, overLimit && styles.counterError]}>
                  {t('charactersCount', { count: message.length, max: MESSAGE_CHECK_MAX_LENGTH })}
                </Text>
              </View>

              <Pressable onPress={addScreenshot} style={styles.addScreenshot} hitSlop={8}>
                <Icon name="image-outline" size={18} color={Colors.text} />
                <Text style={styles.addScreenshotText}>{t('addScreenshot')}</Text>
              </Pressable>
              {pickErrorKey && <Text style={styles.errorText}>{t(pickErrorKey)}</Text>}
            </>
          )}
          <Text style={styles.privacyNote}>{t('screenshotPrivacyNote')}</Text>

          <PrimaryButton
            label={checking ? t('checkingMessage') : screenshot ? t('checkScreenshot') : t('checkMessage')}
            variant="secondary"
            disabled={!canSubmit || checking}
            onPress={runCheck}
          />

          {checking && (
            <View style={styles.loadingRow} testID="message-check-loading">
              <ActivityIndicator color={Colors.accent} />
              <Text style={styles.loadingText}>
                {slowCheck ? t('checkingMessageSlow') : screenshot ? t('checkingScreenshot') : t('checkingMessage')}
              </Text>
            </View>
          )}

          {!checking && checkError && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{t(errorKey(checkError))}</Text>
              {/* Re-sending a picture with no message in it can't help — the way forward is a different picture. */}
              {checkError !== 'no-text-found' && (
                <Pressable onPress={runCheck} style={styles.retryButton} hitSlop={8}>
                  <Text style={styles.retryText}>{t('tryAgain')}</Text>
                </Pressable>
              )}
            </View>
          )}

          {!checking && checkResult && (
            <View style={styles.resultCard}>
              <Text style={styles.verdict}>{t(`verdict${capitalize(checkResult.verdict)}`)}</Text>
              <Text style={styles.confidence}>
                {t('confidenceLabel')}: {t(`confidence${capitalize(checkResult.confidence)}`)}
              </Text>
              <Text style={styles.redFlagsHeading}>
                {checkResult.redFlags.length > 0 ? t('redFlagsFound') : t('noRedFlagsFound')}
              </Text>
              {checkResult.redFlags.map((flag, i) => (
                <Text key={i} style={styles.redFlag}>
                  • {flag}
                </Text>
              ))}
              <Text style={styles.explanation}>{checkResult.explanation}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function capitalize<T extends string>(value: T): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  title: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 26, color: Colors.text },
  subtitle: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 19, color: Colors.textMuted, marginTop: Spacing.sm },
  rule: { height: 2, backgroundColor: Colors.text, marginTop: Spacing.md },
  aiSection: { padding: Spacing.lg, gap: Spacing.sm, borderTopWidth: 2, borderTopColor: Colors.divider },
  aiKicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: Radii.sm,
    padding: Spacing.sm,
    minHeight: 44,
  },
  inputRowError: { borderColor: Colors.accent },
  input: { flex: 1, fontFamily: Fonts.body, fontSize: 13, color: Colors.text, minHeight: 28 },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  counter: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textMuted },
  counterError: { color: Colors.accent },
  addScreenshot: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.sm,
    minHeight: 44,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.md,
  },
  addScreenshotText: { fontFamily: Fonts.bodyMedium, fontSize: 13, fontWeight: '700', color: Colors.text },
  privacyNote: { fontFamily: Fonts.body, fontSize: 11, lineHeight: 16, color: Colors.textMuted },
  previewWrap: { gap: Spacing.sm },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Colors.divider,
    backgroundColor: Colors.neutral200,
  },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  loadingText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMuted },
  errorCard: { gap: Spacing.sm },
  errorText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.accent700 },
  retryButton: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: Colors.accent,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  retryText: { fontFamily: Fonts.bodyMedium, fontSize: 13, fontWeight: '700', color: Colors.accent },
  resultCard: {
    gap: Spacing.xs,
    backgroundColor: Colors.card,
    borderRadius: Radii.sm,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  verdict: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 16, color: Colors.text },
  confidence: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMuted },
  redFlagsHeading: { fontFamily: Fonts.bodyMedium, fontWeight: '700', fontSize: 12, color: Colors.text, marginTop: Spacing.xs },
  redFlag: { fontFamily: Fonts.body, fontSize: 12, lineHeight: 18, color: Colors.text },
  explanation: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 19, color: Colors.text, marginTop: Spacing.xs },
});
