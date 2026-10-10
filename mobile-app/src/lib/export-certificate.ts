import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { CERTIFICATE_PAGE } from '@/lib/certificate-html';

export type ExportCertificateResult = { ok: true } | { ok: false; reason: 'export-failed' | 'share-unavailable' };

// A browser can't save a file from the app and share it, so it prints the certificate page instead
// (the print dialog offers "Save as PDF"). expo-print on web would print the whole app screen.
function printInBrowser(html: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const frame = document.createElement('iframe');
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
    frame.onload = () => {
      try {
        frame.contentWindow?.focus();
        frame.contentWindow?.print();
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        setTimeout(() => frame.remove(), 60_000);
      }
    };
    frame.srcdoc = html;
    document.body.appendChild(frame);
  });
}

/** Saves the certificate as a PDF and opens the phone's share sheet. Never throws — every failure comes back as a tagged reason the screen can show. */
export async function exportCertificate(html: string, dialogTitle: string): Promise<ExportCertificateResult> {
  if (!html) return { ok: false, reason: 'export-failed' };
  try {
    if (Platform.OS === 'web') {
      await printInBrowser(html);
      return { ok: true };
    }

    const { uri } = await Print.printToFileAsync({ html, ...CERTIFICATE_PAGE });
    if (!uri) return { ok: false, reason: 'export-failed' };
    if (!(await Sharing.isAvailableAsync())) return { ok: false, reason: 'share-unavailable' };

    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle });
    return { ok: true };
  } catch (err) {
    console.error('exportCertificate: could not create or share the PDF', err);
    return { ok: false, reason: 'export-failed' };
  }
}
