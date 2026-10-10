const mockPrintToFileAsync = jest.fn();
const mockIsAvailableAsync = jest.fn();
const mockShareAsync = jest.fn();

jest.mock('expo-print', () => ({
  printToFileAsync: (...args: unknown[]) => mockPrintToFileAsync(...args),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: (...args: unknown[]) => mockIsAvailableAsync(...args),
  shareAsync: (...args: unknown[]) => mockShareAsync(...args),
}));

import { exportCertificate } from '@/lib/export-certificate';

const HTML = '<!DOCTYPE html><html><body>cert</body></html>';

describe('exportCertificate', () => {
  beforeEach(() => {
    mockPrintToFileAsync.mockReset().mockResolvedValue({ uri: 'file:///cache/cert.pdf', numberOfPages: 1 });
    mockIsAvailableAsync.mockReset().mockResolvedValue(true);
    mockShareAsync.mockReset().mockResolvedValue(undefined);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it('turns the certificate into a one-page portrait A4 PDF and opens the share sheet with it', async () => {
    expect(await exportCertificate(HTML, 'Certificate')).toEqual({ ok: true });
    expect(mockPrintToFileAsync).toHaveBeenCalledWith(expect.objectContaining({ html: HTML, width: 595, height: 842 }));
    expect(mockShareAsync).toHaveBeenCalledWith(
      'file:///cache/cert.pdf',
      expect.objectContaining({ mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: 'Certificate' })
    );
  });

  it('reports "export-failed" instead of throwing when the PDF cannot be created', async () => {
    mockPrintToFileAsync.mockRejectedValue(new Error('out of storage'));
    expect(await exportCertificate(HTML, 'Certificate')).toEqual({ ok: false, reason: 'export-failed' });
    expect(mockShareAsync).not.toHaveBeenCalled();
  });

  it('reports "export-failed" when the PDF step hands back no file', async () => {
    mockPrintToFileAsync.mockResolvedValue({ uri: '', numberOfPages: 0 });
    expect(await exportCertificate(HTML, 'Certificate')).toEqual({ ok: false, reason: 'export-failed' });
  });

  it('reports "share-unavailable" when this device cannot share files', async () => {
    mockIsAvailableAsync.mockResolvedValue(false);
    expect(await exportCertificate(HTML, 'Certificate')).toEqual({ ok: false, reason: 'share-unavailable' });
    expect(mockShareAsync).not.toHaveBeenCalled();
  });

  it('reports "export-failed" instead of throwing when the share sheet itself fails', async () => {
    mockShareAsync.mockRejectedValue(new Error('share crashed'));
    expect(await exportCertificate(HTML, 'Certificate')).toEqual({ ok: false, reason: 'export-failed' });
  });

  it('refuses an empty certificate without touching the phone', async () => {
    expect(await exportCertificate('', 'Certificate')).toEqual({ ok: false, reason: 'export-failed' });
    expect(mockPrintToFileAsync).not.toHaveBeenCalled();
  });
});
