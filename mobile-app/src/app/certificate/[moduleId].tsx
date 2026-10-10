import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Certificate } from '@/components/certificate';
import { NameForm } from '@/components/name-form';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenHeader } from '@/components/screen-header';
import { Colors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import type { LanguageCode } from '@/i18n';
import { buildCertificateView, listCertificates, type CertificateView } from '@/lib/certificate';
import { buildCertificateHtml } from '@/lib/certificate-html';
import { exportCertificate, type ExportCertificateResult } from '@/lib/export-certificate';
import { useAppStore } from '@/store/useAppStore';

type ExportError = Extract<ExportCertificateResult, { ok: false }>['reason'];

const EXPORT_ERROR_KEY: Record<ExportError, string> = {
  'export-failed': 'certificateExportFailed',
  'share-unavailable': 'certificateShareUnavailable',
};

/** The certificate settling onto the page: a short fade and rise, once, when it first appears. */
function Reveal({ children }: { children: React.ReactNode }) {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: 450, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [progress]);

  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }],
      }}>
      {children}
    </Animated.View>
  );
}

function Message({ text, action, onAction }: { text: string; action: string; onAction: () => void }) {
  return (
    <View style={styles.message}>
      <Text style={styles.messageText}>{text}</Text>
      <PrimaryButton label={action} onPress={onAction} />
    </View>
  );
}

function EarnedCertificate({ view, onEditName }: { view: CertificateView; onEditName: () => void }) {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<ExportError | null>(null);
  const exportingRef = useRef(false);

  const width = Math.min(windowWidth, MaxContentWidth) - Spacing.md * 2;

  const download = async () => {
    if (exportingRef.current) return;
    exportingRef.current = true;
    setExporting(true);
    setExportError(null);
    const result = await exportCertificate(buildCertificateHtml(view), t('certificate'));
    exportingRef.current = false;
    setExporting(false);
    if (!result.ok) setExportError(result.reason);
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.congrats}>{t('certificateEarnedNote')}</Text>
      <Reveal>
        <View style={styles.shadow}>
          <Certificate view={view} width={width} />
        </View>
      </Reveal>

      <View style={[styles.actions, { width }]}>
        <PrimaryButton
          label={exporting ? t('certificatePreparing') : t('download')}
          disabled={exporting}
          onPress={() => void download()}
        />
        {exporting && <ActivityIndicator testID="certificate-exporting" color={Colors.accent} />}
        {exportError && <Text style={styles.exportError}>{t(EXPORT_ERROR_KEY[exportError])}</Text>}
        <PrimaryButton label={t('certificateEditName')} variant="ghost" onPress={onEditName} />
      </View>
    </ScrollView>
  );
}

export default function CertificateScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const { t } = useTranslation();
  const language = (useAppStore((s) => s.language) ?? 'en') as LanguageCode;
  const studentName = useAppStore((s) => s.studentName);
  const setStudentName = useAppStore((s) => s.setStudentName);
  const certificates = useAppStore((s) => s.certificates);
  const earnedBadgeIds = useAppStore((s) => s.earnedBadgeIds);
  const [editingName, setEditingName] = useState(false);

  const entry = listCertificates(certificates, earnedBadgeIds).find((c) => c.moduleId === moduleId);
  const view =
    entry?.earned && studentName
      ? buildCertificateView({ moduleId: entry.moduleId, record: entry.record, name: studentName, fallbackLanguage: language })
      : null;

  let body: React.ReactNode;
  if (!entry) {
    body = <Message text={t('certificateUnavailable')} action={t('back')} onAction={() => router.back()} />;
  } else if (!entry.earned) {
    body = (
      <Message
        text={t('certificateNotEarned', { module: t(`moduleTitle_${entry.moduleId}`) })}
        action={t('certificateGoToModule')}
        onAction={() => router.replace(`/module/${entry.moduleId}`)}
      />
    );
  } else if (!view || editingName) {
    body = (
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <NameForm
          initialName={studentName ?? ''}
          heading={t('certificateNameHeading')}
          help={t('certificateNameHelp')}
          saveLabel={t('certificateSaveName')}
          cancelLabel={t('back')}
          inputTestID="certificate-name-input"
          onSave={(name) => {
            setStudentName(name);
            setEditingName(false);
          }}
          onCancel={editingName ? () => setEditingName(false) : undefined}
        />
      </ScrollView>
    );
  } else {
    body = <EarnedCertificate view={view} onEditName={() => setEditingName(true)} />;
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenHeader title={t('certificate')} />
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, alignItems: 'center', gap: Spacing.md },
  congrats: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 16, color: Colors.text, textAlign: 'center' },
  shadow: {
    backgroundColor: Colors.paper,
    boxShadow: '0 6px 14px rgba(32, 30, 29, 0.18)',
  },
  actions: { gap: Spacing.sm, alignItems: 'center' },
  exportError: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 19, color: Colors.accent700, textAlign: 'center' },
  message: { padding: Spacing.lg, gap: Spacing.md },
  messageText: { fontFamily: Fonts.body, fontSize: 15, lineHeight: 22, color: Colors.text },
});
