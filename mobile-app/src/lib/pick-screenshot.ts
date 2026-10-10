import * as ImagePicker from 'expo-image-picker';

export type PickedScreenshot = { uri: string; base64: string; mimeType?: string };

export type PickScreenshotResult =
  | { ok: true; screenshot: PickedScreenshot }
  | { ok: false; reason: 'cancelled' | 'unreadable' };

const DATA_URI = /^data:([^;,]+);base64,(.*)$/;

/** Lets the student choose one picture from their phone. Never throws — closing the picker and a picture that can't be read both come back as a tagged reason the screen can act on. */
export async function pickScreenshot(): Promise<PickScreenshotResult> {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      quality: 0.7,
    });
    const asset = result.canceled ? undefined : result.assets?.[0];
    if (!asset) return { ok: false, reason: 'cancelled' };

    // On web the picker hands back the picture as a data address and no separate copy of the data.
    const fromUri = DATA_URI.exec(asset.uri);
    const base64 = asset.base64 || fromUri?.[2];
    if (!base64) return { ok: false, reason: 'unreadable' };

    return { ok: true, screenshot: { uri: asset.uri, base64, mimeType: asset.mimeType ?? fromUri?.[1] } };
  } catch (err) {
    console.error('pickScreenshot: the image picker failed', err);
    return { ok: false, reason: 'unreadable' };
  }
}
