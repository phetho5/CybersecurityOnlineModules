import { StyleSheet, Text, View } from 'react-native';

import { BrandLogo } from '@/components/brand-logo';
import { Icon } from '@/components/icon';
import { Colors, Fonts } from '@/constants/theme';
import { certificateNameScale, type CertificateView } from '@/lib/certificate';
import { CERTIFICATE_PAGE, LOGO_SIZE, SEAL_SIZE } from '@/lib/certificate-html';

const WHITE_RING = 'rgba(255, 255, 255, 0.75)';

/** The red starburst medallion with its two ribbon tails. `size` is the width; it is 98/76 as tall. */
export function CertificateSeal({ size, dimmed = false }: { size: number; dimmed?: boolean }) {
  const u = size / 76;
  const fill = dimmed ? Colors.neutral400 : Colors.accent;
  const tail = dimmed ? Colors.neutral500 : Colors.accent700;
  const burst = {
    position: 'absolute' as const,
    top: 11.4 * u,
    left: 11.4 * u,
    width: 53.2 * u,
    height: 53.2 * u,
    borderRadius: 6 * u,
    backgroundColor: fill,
  };
  const tailBase = { position: 'absolute' as const, top: 46 * u, width: 16 * u, height: 46 * u, backgroundColor: tail };

  return (
    <View style={{ width: size, height: 98 * u }}>
      <View style={[tailBase, { left: 18 * u, transform: [{ rotate: '14deg' }] }]} />
      <View style={[tailBase, { right: 18 * u, transform: [{ rotate: '-14deg' }] }]} />
      <View style={burst} />
      <View style={[burst, { transform: [{ rotate: '30deg' }] }]} />
      <View style={[burst, { transform: [{ rotate: '60deg' }] }]} />
      <View
        style={{
          position: 'absolute',
          top: 14.5 * u,
          left: 14.5 * u,
          width: 47 * u,
          height: 47 * u,
          borderRadius: 47 * u,
          borderWidth: Math.max(1, u),
          borderColor: WHITE_RING,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name={dimmed ? 'lock-closed' : 'shield-checkmark'} size={24 * u} color={Colors.accentContrast} />
      </View>
    </View>
  );
}

function Detail({ item, small, u, compact }: { item: { label: string; value: string }; small?: string; u: number; compact?: boolean }) {
  return (
    <View style={styles.detail}>
      <Text style={[styles.label, { fontSize: 6.5 * u, letterSpacing: u }]}>{item.label}</Text>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.value, { fontSize: (compact ? 8 : 11) * u, lineHeight: 13 * u, marginTop: 3 * u }]}>
        {item.value}
      </Text>
      {small ? <Text style={[styles.small, { fontSize: 6.5 * u, marginTop: u }]}>{small}</Text> : null}
    </View>
  );
}

/**
 * The certificate as shown on screen, drawn on a 360-unit-wide grid scaled to `width`.
 * `lib/certificate-html.ts` draws the same thing for the PDF, so change the two together.
 */
export function Certificate({ view, width }: { view: CertificateView; width: number }) {
  const u = width / 360;
  const height = (width * CERTIFICATE_PAGE.height) / CERTIFICATE_PAGE.width;
  const corner = { position: 'absolute' as const, width: 7 * u, height: 7 * u, backgroundColor: Colors.accent };
  const nameScale = certificateNameScale(view.name);
  const hasDetails = Boolean(view.score || view.date || view.number);

  return (
    <View testID="certificate" style={[styles.paper, { width, height, padding: 12 * u }]}>
      <View style={[styles.frame, { borderWidth: 1.5 * u, padding: 3 * u }]}>
        <View style={[styles.inner, { borderWidth: Math.max(StyleSheet.hairlineWidth, 0.5 * u), paddingTop: 24 * u, paddingHorizontal: 20 * u, paddingBottom: 18 * u }]}>
          <View style={styles.group}>
            <BrandLogo size={LOGO_SIZE * u} decorative />
            <Text style={[styles.brand, { fontSize: 9 * u, letterSpacing: 2.4 * u, marginTop: 6 * u }]}>CyberAware SA</Text>
            <Text style={[styles.title, { fontSize: 23 * u, lineHeight: 26 * u, marginTop: 8 * u }]}>{view.title}</Text>
            <View style={{ width: 40 * u, height: 2 * u, backgroundColor: Colors.accent, marginTop: 12 * u }} />
          </View>

          <View style={styles.group}>
            <Text style={[styles.caps, { fontSize: 8 * u, letterSpacing: 1.4 * u }]}>{view.presentedTo}</Text>
            <Text
              numberOfLines={3}
              adjustsFontSizeToFit
              style={[styles.name, { fontSize: 25 * u * nameScale, lineHeight: 30 * u * nameScale, marginTop: 8 * u }]}>
              {view.name}
            </Text>
            <View style={{ width: '70%', height: Math.max(1, u), backgroundColor: Colors.text, marginTop: 8 * u, marginBottom: 10 * u }} />
            <Text style={[styles.completed, { fontSize: 10 * u }]}>{view.completed}</Text>
            <Text style={[styles.module, { fontSize: 17 * u, lineHeight: 21 * u, marginTop: 4 * u }]}>{view.moduleTitle}</Text>
          </View>

          <View style={styles.group}>
            <CertificateSeal size={SEAL_SIZE * u} />
            <Text style={[styles.badge, { fontSize: 9 * u, letterSpacing: 1.6 * u, marginTop: 6 * u }]}>{view.badgeName}</Text>
          </View>

          <View style={styles.group}>
            {hasDetails && (
              <View style={[styles.details, { marginTop: 12 * u }]}>
                {view.score && <Detail item={view.score} small={view.score.passMark} u={u} />}
                {view.date && <Detail item={view.date} u={u} />}
                {view.number && <Detail item={view.number} u={u} compact />}
              </View>
            )}
            <View style={[styles.group, styles.footer, { borderTopWidth: Math.max(StyleSheet.hairlineWidth, 0.5 * u), paddingTop: 10 * u, marginTop: 10 * u }]}>
              <Text style={[styles.label, { fontSize: 6.5 * u, letterSpacing: u }]}>{view.researchersLabel}</Text>
              {/* Each name is its own text, so two long names wrap onto separate lines instead of colliding. */}
              <View style={[styles.researchers, { marginTop: 3 * u, columnGap: 14 * u }]}>
                {view.researchers.map((researcher) => (
                  <Text key={researcher} style={[styles.value, { fontSize: 10 * u }]}>
                    {researcher}
                  </Text>
                ))}
              </View>
              <Text style={[styles.small, { fontSize: 7 * u, marginTop: 4 * u }]}>{view.project}</Text>
            </View>
          </View>
        </View>

        <View style={[corner, { top: -4 * u, left: -4 * u }]} />
        <View style={[corner, { top: -4 * u, right: -4 * u }]} />
        <View style={[corner, { bottom: -4 * u, left: -4 * u }]} />
        <View style={[corner, { bottom: -4 * u, right: -4 * u }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  paper: { backgroundColor: Colors.paper },
  frame: { flex: 1, borderColor: Colors.text },
  inner: { flex: 1, borderColor: Colors.neutral400, alignItems: 'center', justifyContent: 'space-between' },
  group: { alignItems: 'center', width: '100%' },
  brand: { fontFamily: Fonts.heading, fontWeight: '800', textTransform: 'uppercase', color: Colors.accent700 },
  title: { fontFamily: Fonts.heading, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  caps: { fontFamily: Fonts.bodyMedium, fontWeight: '600', textTransform: 'uppercase', color: Colors.textMuted, textAlign: 'center' },
  name: { fontFamily: Fonts.heading, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  completed: { fontFamily: Fonts.body, color: Colors.textMuted, textAlign: 'center' },
  module: { fontFamily: Fonts.heading, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  badge: { fontFamily: Fonts.heading, fontWeight: '800', textTransform: 'uppercase', color: Colors.accent700, textAlign: 'center' },
  details: { flexDirection: 'row', width: '100%' },
  detail: { flex: 1, alignItems: 'center', paddingHorizontal: 2 },
  label: { fontFamily: Fonts.bodyMedium, fontWeight: '600', textTransform: 'uppercase', color: Colors.textMuted, textAlign: 'center' },
  value: { fontFamily: Fonts.bodyMedium, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  small: { fontFamily: Fonts.body, color: Colors.textMuted, textAlign: 'center' },
  footer: { borderTopColor: Colors.neutral400 },
  researchers: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
});
