import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { Colors, Fonts, MaxContentWidth, Radii, Spacing } from '@/constants/theme';
import { CERTIFICATE_NAME_MAX_LENGTH, validateCertificateName } from '@/lib/certificate';

const NAME_ERROR_KEY = {
  required: 'certificateNameRequired',
  'too-short': 'certificateNameTooShort',
  'too-long': 'certificateNameTooLong',
} as const;

/** The one box a student types their name into: used on Profile and the first time a certificate is opened. */
export function NameForm({
  initialName,
  heading,
  help,
  saveLabel,
  cancelLabel,
  inputTestID,
  onSave,
  onCancel,
}: {
  initialName: string;
  heading?: string;
  help: string;
  saveLabel: string;
  cancelLabel?: string;
  inputTestID: string;
  onSave: (name: string) => void;
  onCancel?: () => void;
}) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(initialName);
  const [touched, setTouched] = useState(false);
  const validation = validateCertificateName(draft);

  // Too long is said straight away; too short only once the student has left the box, so it
  // doesn't scold them mid-word. An empty box just says why the button is waiting.
  const reason = validation.ok ? null : validation.reason;
  const showReason = reason === 'required' || reason === 'too-long' || (reason === 'too-short' && touched);
  const isError = showReason && reason !== 'required';

  return (
    <View style={styles.form}>
      {heading && <Text style={styles.formHeading}>{heading}</Text>}
      <Text style={styles.formHelp}>{help}</Text>
      <TextInput
        testID={inputTestID}
        value={draft}
        onChangeText={setDraft}
        onBlur={() => setTouched(true)}
        placeholder={t('certificateNamePlaceholder')}
        placeholderTextColor={Colors.neutral500}
        autoCapitalize="words"
        autoCorrect={false}
        autoComplete="name"
        returnKeyType="done"
        style={[styles.input, isError && styles.inputError]}
      />
      <View style={styles.formMeta}>
        <Text style={[styles.formReason, isError && styles.formReasonError]}>
          {showReason && reason ? t(NAME_ERROR_KEY[reason]) : ''}
        </Text>
        <Text style={[styles.formCount, reason === 'too-long' && styles.formReasonError]}>
          {t('charactersCount', { count: draft.length, max: CERTIFICATE_NAME_MAX_LENGTH })}
        </Text>
      </View>
      <PrimaryButton label={saveLabel} disabled={!validation.ok} onPress={() => validation.ok && onSave(validation.name)} />
      {onCancel && cancelLabel && <PrimaryButton label={cancelLabel} variant="ghost" onPress={onCancel} />}
    </View>
  );
}

const styles = StyleSheet.create({
  form: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.sm, paddingTop: Spacing.sm },
  formHeading: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 20, lineHeight: 26, color: Colors.text },
  formHelp: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 19, color: Colors.neutral800 },
  input: {
    minHeight: 48,
    borderWidth: 2,
    borderColor: Colors.text,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    fontFamily: Fonts.bodyMedium,
    fontSize: 16,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  inputError: { borderColor: Colors.accent700 },
  formMeta: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm, minHeight: 18 },
  formReason: { flex: 1, fontFamily: Fonts.body, fontSize: 12, color: Colors.textMuted },
  formReasonError: { color: Colors.accent700 },
  formCount: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMuted },
});
