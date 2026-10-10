import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

const mockReplace = jest.fn();
const mockBack = jest.fn();
let mockParams: { moduleId?: string } = { moduleId: '02' };

jest.mock('expo-router', () => ({
  router: {
    replace: (...args: unknown[]) => mockReplace(...args),
    back: (...args: unknown[]) => mockBack(...args),
    push: jest.fn(),
    canGoBack: () => true,
  },
  useLocalSearchParams: () => mockParams,
}));

const mockExportCertificate = jest.fn();
jest.mock('@/lib/export-certificate', () => ({
  exportCertificate: (...args: unknown[]) => mockExportCertificate(...args),
}));

import CertificateScreen from '@/app/certificate/[moduleId]';
import i18n from '@/i18n';
import { CERTIFICATE_NAME_MAX_LENGTH, type CertificateRecord } from '@/lib/certificate';
import { useAppStore } from '@/store/useAppStore';

const initialState = useAppStore.getState();

// The first test to draw the name box or the certificate also pays for loading them, which on a
// busy machine can take longer than Jest's 5-second default.
jest.setTimeout(20_000);
const tr = (lang: string, key: string, options?: Record<string, unknown>) => i18n.t(key, { lng: lang, ...options }) as string;

const RECORD: CertificateRecord = {
  id: 'CA-02-20261005-ABCD',
  moduleId: '02',
  scorePct: 80,
  awardedAt: new Date(2026, 9, 5, 12).toISOString(),
  language: 'en',
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

const earned = (extra: Record<string, unknown> = {}) =>
  useAppStore.setState({ earnedBadgeIds: ['scam-spotter'], certificates: { '02': RECORD }, ...extra });

describe('CertificateScreen', () => {
  beforeEach(async () => {
    useAppStore.setState({ ...initialState, language: 'en' }, true);
    await i18n.changeLanguage('en');
    mockParams = { moduleId: '02' };
    mockReplace.mockClear();
    mockBack.mockClear();
    mockExportCertificate.mockReset().mockResolvedValue({ ok: true });
  });

  describe('when there is nothing to show', () => {
    it.each(['01', '99', undefined])('says there is no certificate for module %s and offers a way back, instead of a blank screen', async (moduleId) => {
      mockParams = { moduleId };
      const { getByText, queryByTestId } = await render(<CertificateScreen />);
      expect(getByText('There is no certificate for this module.')).toBeTruthy();
      expect(queryByTestId('certificate')).toBeNull();
      await fireEvent.press(getByText('Back'));
      expect(mockBack).toHaveBeenCalled();
    });

    it('tells a student who has not passed yet how to earn it, and takes them to the module', async () => {
      const { getByText, queryByTestId } = await render(<CertificateScreen />);
      expect(getByText("You haven't earned this certificate yet. Pass the Online Scams final assessment to earn it.")).toBeTruthy();
      expect(queryByTestId('certificate')).toBeNull();
      expect(queryByTestId('certificate-name-input')).toBeNull();
      await fireEvent.press(getByText('Go to the module'));
      expect(mockReplace).toHaveBeenCalledWith('/module/02');
    });
  });

  describe('asking for the name (first time)', () => {
    beforeEach(() => earned());

    it('asks for a name before showing the certificate, and says why the button is not ready yet', async () => {
      const { getByText, getByTestId, queryByTestId } = await render(<CertificateScreen />);
      expect(getByText('What name should go on your certificate?')).toBeTruthy();
      expect(getByTestId('certificate-name-input')).toBeTruthy();
      expect(getByText('Enter your name to continue.')).toBeTruthy();
      expect(queryByTestId('certificate')).toBeNull();
    });

    it('does nothing when the button is pressed with no name', async () => {
      const { getByText, queryByTestId } = await render(<CertificateScreen />);
      await fireEvent.press(getByText('Show my certificate'));
      expect(useAppStore.getState().studentName).toBeNull();
      expect(queryByTestId('certificate')).toBeNull();
    });

    it('does not accept a name made only of spaces', async () => {
      const { getByText, getByTestId, queryByTestId } = await render(<CertificateScreen />);
      await fireEvent.changeText(getByTestId('certificate-name-input'), '     ');
      await fireEvent.press(getByText('Show my certificate'));
      expect(useAppStore.getState().studentName).toBeNull();
      expect(queryByTestId('certificate')).toBeNull();
    });

    it('points out a too-short name as soon as the student leaves the box', async () => {
      const { getByText, getByTestId, queryByText } = await render(<CertificateScreen />);
      await fireEvent.changeText(getByTestId('certificate-name-input'), 'T');
      expect(queryByText('Enter at least 2 characters.')).toBeNull();
      await fireEvent(getByTestId('certificate-name-input'), 'blur');
      expect(getByText('Enter at least 2 characters.')).toBeTruthy();
    });

    it('shows a character count, and blocks a name over the limit with a reason', async () => {
      const { getByText, getByTestId, queryByTestId } = await render(<CertificateScreen />);
      await fireEvent.changeText(getByTestId('certificate-name-input'), 'Thandi');
      expect(getByText(`6 / ${CERTIFICATE_NAME_MAX_LENGTH}`)).toBeTruthy();

      await fireEvent.changeText(getByTestId('certificate-name-input'), 'a'.repeat(CERTIFICATE_NAME_MAX_LENGTH + 1));
      expect(getByText('That name is too long — shorten it to continue.')).toBeTruthy();
      await fireEvent.press(getByText('Show my certificate'));
      expect(queryByTestId('certificate')).toBeNull();
    });

    it('saves a valid name and shows the certificate with it', async () => {
      const { getByText, getByTestId, queryByTestId } = await render(<CertificateScreen />);
      await fireEvent.changeText(getByTestId('certificate-name-input'), '  Thandi   Nkosi ');
      await fireEvent.press(getByText('Show my certificate'));
      expect(useAppStore.getState().studentName).toBe('Thandi Nkosi');
      expect(getByTestId('certificate')).toBeTruthy();
      expect(getByText('Thandi Nkosi')).toBeTruthy();
      expect(queryByTestId('certificate-name-input')).toBeNull();
    });
  });

  describe('showing the certificate', () => {
    it('shows the name, module, badge, score, date, number and researchers', async () => {
      earned({ studentName: 'Thandi Nkosi' });
      const { getByText } = await render(<CertificateScreen />);
      for (const text of ['Certificate of Completion', 'Thandi Nkosi', 'Online Scams', 'Scam Spotter', '80%', '05/10/2026', 'CA-02-20261005-ABCD', 'Phetho Nemavhola', 'Vhulenda Mashamba']) {
        expect(getByText(text)).toBeTruthy();
      }
    });

    it('skips the name question for a student who has already given their name', async () => {
      earned({ studentName: 'Thandi Nkosi' });
      const { queryByTestId, getByTestId } = await render(<CertificateScreen />);
      expect(getByTestId('certificate')).toBeTruthy();
      expect(queryByTestId('certificate-name-input')).toBeNull();
    });

    it('shows a certificate without score, date or number for a badge earned before certificates existed', async () => {
      useAppStore.setState({ earnedBadgeIds: ['scam-spotter'], certificates: {}, studentName: 'Thandi Nkosi' });
      const { getByText, getByTestId, queryByText } = await render(<CertificateScreen />);
      expect(getByTestId('certificate')).toBeTruthy();
      expect(getByText('Thandi Nkosi')).toBeTruthy();
      expect(queryByText('Date awarded')).toBeNull();
      expect(queryByText('Certificate no.')).toBeNull();
      expect(queryByText(/null|undefined|NaN/)).toBeNull();
    });

    it('keeps the certificate in the language the module was passed in, while the buttons follow the app', async () => {
      earned({ studentName: 'Thandi Nkosi', certificates: { '02': { ...RECORD, language: 'zu' } } });
      const { getByText, queryByText } = await render(<CertificateScreen />);
      expect(getByText(tr('zu', 'certificateTitle'))).toBeTruthy();
      expect(getByText(tr('zu', 'moduleTitle_02'))).toBeTruthy();
      expect(queryByText('Certificate of Completion')).toBeNull();
      expect(getByText('Download PDF')).toBeTruthy();
    });

    it('shows an English certificate in English even after the app is switched to isiZulu', async () => {
      earned({ studentName: 'Thandi Nkosi', language: 'zu' });
      await i18n.changeLanguage('zu');
      const { getByText } = await render(<CertificateScreen />);
      expect(getByText('Certificate of Completion')).toBeTruthy();
      expect(getByText(tr('zu', 'download'))).toBeTruthy();
    });

    it('still fits a very long name on the certificate', async () => {
      const longName = 'Nomvula Thandiwe Mahlangu-Van der Westhuizen Nkosazana';
      earned({ studentName: longName });
      const { getByText } = await render(<CertificateScreen />);
      const size = (text: string) => StyleSheet.flatten(getByText(text).props.style).fontSize;
      const longSize = size(longName);
      expect(getByText(longName).props.adjustsFontSizeToFit).toBe(true);

      await act(async () => useAppStore.getState().setStudentName('Thandi Nkosi'));
      expect(longSize).toBeLessThan(size('Thandi Nkosi'));
    });
  });

  describe('changing the name', () => {
    beforeEach(() => earned({ studentName: 'Thandi Nkosi' }));

    it('reopens the name box with the current name already filled in', async () => {
      const { getByText, getByTestId } = await render(<CertificateScreen />);
      await fireEvent.press(getByText('Change name'));
      expect(getByTestId('certificate-name-input').props.value).toBe('Thandi Nkosi');
    });

    it('updates the certificate with the new name', async () => {
      const { getByText, getByTestId } = await render(<CertificateScreen />);
      await fireEvent.press(getByText('Change name'));
      await fireEvent.changeText(getByTestId('certificate-name-input'), 'Thandiwe Nkosi');
      await fireEvent.press(getByText('Show my certificate'));
      expect(getByText('Thandiwe Nkosi')).toBeTruthy();
      expect(useAppStore.getState().studentName).toBe('Thandiwe Nkosi');
    });

    it('keeps the old name when the student backs out of the change', async () => {
      const { getByText, getByTestId } = await render(<CertificateScreen />);
      await fireEvent.press(getByText('Change name'));
      await fireEvent.changeText(getByTestId('certificate-name-input'), 'Someone Else');
      await fireEvent.press(getByText('Back'));
      expect(getByText('Thandi Nkosi')).toBeTruthy();
      expect(useAppStore.getState().studentName).toBe('Thandi Nkosi');
      expect(mockBack).not.toHaveBeenCalled();
    });
  });

  describe('downloading the PDF', () => {
    beforeEach(() => earned({ studentName: 'Thandi Nkosi' }));

    it('exports a page carrying the student’s name and certificate number', async () => {
      const { getByText } = await render(<CertificateScreen />);
      await fireEvent.press(getByText('Download PDF'));
      expect(mockExportCertificate).toHaveBeenCalledTimes(1);
      const [html] = mockExportCertificate.mock.calls[0];
      expect(html).toContain('Thandi Nkosi');
      expect(html).toContain('CA-02-20261005-ABCD');
    });

    it('says it is preparing the certificate while the PDF is being made, then returns to normal', async () => {
      const { promise, resolve } = deferred<{ ok: true }>();
      mockExportCertificate.mockReturnValue(promise);
      const { getByText, queryByText } = await render(<CertificateScreen />);

      await act(async () => {
        fireEvent.press(getByText('Download PDF'));
      });
      expect(getByText('Preparing your certificate…')).toBeTruthy();

      await act(async () => {
        resolve({ ok: true });
        await promise;
      });
      expect(queryByText('Preparing your certificate…')).toBeNull();
      expect(getByText('Download PDF')).toBeTruthy();
    });

    it('ignores a second tap while the first PDF is still being made (double-tap guard)', async () => {
      const { promise, resolve } = deferred<{ ok: true }>();
      mockExportCertificate.mockReturnValue(promise);
      const { getByText } = await render(<CertificateScreen />);
      const button = getByText('Download PDF');

      await act(async () => {
        fireEvent.press(button);
        fireEvent.press(button);
        resolve({ ok: true });
        await promise;
      });
      expect(mockExportCertificate).toHaveBeenCalledTimes(1);
    });

    it('explains a failed PDF next to the button and lets the student try again', async () => {
      mockExportCertificate.mockResolvedValueOnce({ ok: false, reason: 'export-failed' });
      const { getByText, queryByText, getByTestId } = await render(<CertificateScreen />);
      await fireEvent.press(getByText('Download PDF'));
      expect(getByText("Couldn't create the PDF — try again.")).toBeTruthy();
      expect(getByTestId('certificate')).toBeTruthy();

      await fireEvent.press(getByText('Download PDF'));
      expect(mockExportCertificate).toHaveBeenCalledTimes(2);
      expect(queryByText("Couldn't create the PDF — try again.")).toBeNull();
    });

    it('says so plainly when this device cannot share files', async () => {
      mockExportCertificate.mockResolvedValue({ ok: false, reason: 'share-unavailable' });
      const { getByText } = await render(<CertificateScreen />);
      await fireEvent.press(getByText('Download PDF'));
      expect(getByText("This device can't share files — open the app on your phone to download it.")).toBeTruthy();
    });
  });
});
