import { render } from '@testing-library/react-native';
import React from 'react';

import { Certificate } from '@/components/certificate';
import { buildCertificateView, type CertificateRecord } from '@/lib/certificate';
import { LOGO_SIZE } from '@/lib/certificate-html';

const RECORD: CertificateRecord = {
  id: 'CA-02-20261005-ABCD',
  moduleId: '02',
  scorePct: 80,
  awardedAt: new Date(2026, 9, 5, 12).toISOString(),
  language: 'en',
};

const viewFor = (name: string, record: CertificateRecord | null = RECORD) =>
  buildCertificateView({ moduleId: '02', record, name, fallbackLanguage: 'en' })!;

const all = { includeHiddenElements: true };

describe('Certificate: the app logo', () => {
  it('is shown once, with the app name still written out', async () => {
    const { getAllByTestId, getByText } = await render(<Certificate view={viewFor('Thandi Nkosi')} width={360} />);
    expect(getAllByTestId('brand-logo', all)).toHaveLength(1);
    expect(getByText('CyberAware SA')).toBeTruthy();
  });

  it.each([280, 360, 720])('scales with the certificate at %i wide, matching the PDF page', async (width) => {
    const { getByTestId } = await render(<Certificate view={viewFor('Thandi Nkosi')} width={width} />);
    const size = (LOGO_SIZE * width) / 360;
    expect(getByTestId('brand-logo', all)).toHaveStyle({ width: size, height: size });
  });

  it('is not read out twice by a screen reader, because the name is written beside it', async () => {
    const { queryByLabelText } = await render(<Certificate view={viewFor('Thandi Nkosi')} width={360} />);
    expect(queryByLabelText('CyberAware SA')).toBeNull();
  });

  it('is still shown on a certificate with no stored score, date or number, and with a very long name', async () => {
    const view = viewFor('Nomvula Thandiwe Mahlangu-Van der Westhuizen', null);
    const { getAllByTestId } = await render(<Certificate view={view} width={360} />);
    expect(getAllByTestId('brand-logo', all)).toHaveLength(1);
  });
});
