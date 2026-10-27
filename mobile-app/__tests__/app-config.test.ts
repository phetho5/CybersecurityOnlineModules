import fs from 'fs';
import path from 'path';

import { Colors } from '@/constants/theme';

const APP_ROOT = path.join(__dirname, '..');
const { expo } = JSON.parse(fs.readFileSync(path.join(APP_ROOT, 'app.json'), 'utf8'));

const splash = (expo.plugins as unknown[]).find(
  (plugin): plugin is [string, { image: string; backgroundColor: string }] =>
    Array.isArray(plugin) && plugin[0] === 'expo-splash-screen'
)![1];

/** Width and height of a PNG, read from its header. Throws if the file is missing or not a PNG. */
function pngSize(relativePath: string) {
  const bytes = fs.readFileSync(path.join(APP_ROOT, relativePath));
  if (bytes.toString('latin1', 1, 4) !== 'PNG') throw new Error(`${relativePath} is not a PNG`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

/** Every string in app.json that points at a file inside the project. */
function assetPaths(value: unknown): string[] {
  if (typeof value === 'string') return value.startsWith('./') ? [value] : [];
  if (value && typeof value === 'object') return Object.values(value).flatMap(assetPaths);
  return [];
}

describe('app.json: the app name', () => {
  it('is the name students see under the icon, not the project folder name', () => {
    expect(expo.name).toBe('CyberAware SA');
  });
});

describe('app.json: the app icon, splash screen and favicon use the app logo', () => {
  it('points only at files that exist', () => {
    const missing = assetPaths(expo).filter((file) => !fs.existsSync(path.join(APP_ROOT, file)));
    expect(missing).toEqual([]);
  });

  it('has a square 1024 px app icon', () => {
    expect(pngSize(expo.icon)).toEqual({ width: 1024, height: 1024 });
  });

  it('does not send iPhones to the Expo starter icon', () => {
    expect(JSON.stringify(expo.ios ?? {})).not.toContain('expo.icon');
  });

  it.each(['foregroundImage', 'backgroundImage', 'monochromeImage'])('has a square Android %s', (layer) => {
    const { width, height } = pngSize(expo.android.adaptiveIcon[layer]);
    expect(width).toBe(height);
    expect(width).toBeGreaterThanOrEqual(432);
  });

  it('has a square favicon', () => {
    const { width, height } = pngSize(expo.web.favicon);
    expect(width).toBe(height);
  });

  it('opens on the app background colour, not the Expo starter blue', () => {
    expect(splash.backgroundColor.toLowerCase()).toBe(Colors.background.toLowerCase());
    expect(pngSize(splash.image).width).toBeGreaterThanOrEqual(400);
  });

  it('ships a square logo for use inside the app', () => {
    const { width, height } = pngSize('./assets/images/logo.png');
    expect(width).toBe(height);
    expect(width).toBeGreaterThanOrEqual(384);
  });
});

describe('app.json and eas.json: ready for a Google Play build', () => {
  const easPath = path.join(APP_ROOT, 'eas.json');
  const eas = () => JSON.parse(fs.readFileSync(easPath, 'utf8'));

  it('has a valid Android package name, which Google Play needs and which can never change once published', () => {
    expect(expo.android.package).toBe('com.cyberawaresa.app');
    expect(expo.android.package).toMatch(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/);
  });

  it('has a version number in the form Google Play shows to students', () => {
    expect(expo.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('has a production build profile that produces a Play Store bundle', () => {
    expect(fs.existsSync(easPath)).toBe(true);
    const { production } = eas().build;
    expect(production).toBeDefined();
    // An .apk cannot be uploaded to Google Play; the default (app bundle) must not be overridden.
    expect(production.android?.buildType).not.toBe('apk');
  });

  it('gives the production build the Supabase and DeepSeek settings, which are not in git', () => {
    expect(eas().build.production.environment).toBe('production');
  });

  it('raises the Android version code on every production build, so Google Play never rejects a repeat upload', () => {
    expect(eas().cli.appVersionSource).toBe('remote');
    expect(eas().build.production.autoIncrement).toBe(true);
  });

  it('submits to the internal testing track, never straight to the public', () => {
    expect(eas().submit.production.android.track).toBe('internal');
  });

  // Background playback (and its foreground-service permission) is deliberate: _layout.tsx turns it on.
  it('does not ask for the microphone: the app never records, and Google Play questions that permission', () => {
    expect((expo.android.permissions ?? []).filter((p: string) => /RECORD_AUDIO/.test(p))).toEqual([]);
    expect(expo.android.blockedPermissions).toContain('android.permission.RECORD_AUDIO');
  });

  it('keeps secrets out of eas.json', () => {
    const text = fs.readFileSync(easPath, 'utf8');
    expect(text).not.toMatch(/EXPO_PUBLIC_|sk-[A-Za-z0-9]{8,}|eyJ[A-Za-z0-9_-]{10,}/);
    expect(eas().submit.production.android.serviceAccountKeyPath).toBeUndefined();
  });
});

describe('app.json and eas.json: ready for an App Store build', () => {
  const pluginOptions = (name: string) =>
    (expo.plugins as unknown[]).find(
      (plugin): plugin is [string, Record<string, unknown>] => Array.isArray(plugin) && plugin[0] === name
    )?.[1];

  it('has a valid bundle identifier, which Apple needs and which can never change once published', () => {
    expect(expo.ios?.bundleIdentifier).toBe('com.cyberawaresa.app');
    expect(expo.ios.bundleIdentifier).toMatch(/^[A-Za-z][A-Za-z0-9-]*(\.[A-Za-z][A-Za-z0-9-]*)+$/);
  });

  it('answers the export-compliance question up front: the app only uses ordinary HTTPS', () => {
    expect(expo.ios?.infoPlist?.ITSAppUsesNonExemptEncryption).toBe(false);
  });

  it('is an iPhone app, so the App Store does not demand iPad screenshots', () => {
    expect(expo.ios?.supportsTablet).not.toBe(true);
  });

  it('says why it opens the photo library, which Apple rejects apps for leaving vague', () => {
    const reason = pluginOptions('expo-image-picker')?.photosPermission;
    expect(typeof reason).toBe('string');
    expect(reason).toMatch(/screenshot/i);
    expect((reason as string).length).toBeGreaterThanOrEqual(40);
  });

  it('does not claim the camera or the microphone: the app never takes pictures or records', () => {
    expect(pluginOptions('expo-image-picker')?.cameraPermission).toBe(false);
    expect(pluginOptions('expo-image-picker')?.microphonePermission).toBe(false);
    expect(pluginOptions('expo-audio')?.microphonePermission).toBe(false);
  });

  it('still plays lesson audio in the background', () => {
    expect(pluginOptions('expo-audio')?.enableBackgroundPlayback).toBe(true);
  });

  it('keeps Apple sign-in details out of eas.json', () => {
    const ios = JSON.parse(fs.readFileSync(path.join(APP_ROOT, 'eas.json'), 'utf8')).submit.production.ios ?? {};
    expect(Object.keys(ios).filter((key) => /password|ascApiKeyPath/i.test(key))).toEqual([]);
  });
});
