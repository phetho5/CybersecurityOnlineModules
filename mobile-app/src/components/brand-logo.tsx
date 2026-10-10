import { Image } from 'react-native';

const LOGO = require('../../assets/images/logo.png');

/** The app logo. `decorative` hides it from screen readers where the app name is already written beside it. */
export function BrandLogo({ size, decorative = false }: { size: number; decorative?: boolean }) {
  return (
    <Image
      testID="brand-logo"
      source={LOGO}
      resizeMode="contain"
      accessible={!decorative}
      accessibilityLabel={decorative ? undefined : 'CyberAware SA'}
      accessibilityIgnoresInvertColors
      style={{ width: size, height: size }}
    />
  );
}
