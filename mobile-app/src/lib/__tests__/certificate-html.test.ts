import { buildCertificateView, type CertificateRecord, type CertificateView } from '@/lib/certificate';
import { CERTIFICATE_PAGE, LOGO_SIZE, buildCertificateHtml } from '@/lib/certificate-html';
import { LOGO_DATA_URI } from '@/lib/logo-data-uri';

const RECORD: CertificateRecord = {
  id: 'CA-02-20261005-ABCD',
  moduleId: '02',
  scorePct: 80,
  awardedAt: new Date(2026, 9, 5, 12).toISOString(),
  language: 'en',
};

const viewFor = (name: string, record: CertificateRecord | null = RECORD): CertificateView =>
  buildCertificateView({ moduleId: '02', record, name, fallbackLanguage: 'en' })!;

describe('buildCertificateHtml', () => {
  it('prints everything that is on the certificate: name, module, badge, score, date, number and researchers', () => {
    const html = buildCertificateHtml(viewFor('Thandi Nkosi'));
    for (const text of [
      'CyberAware SA',
      'Certificate of Completion',
      'Thandi Nkosi',
      'Online Scams',
      'Scam Spotter',
      '80%',
      '05/10/2026',
      'CA-02-20261005-ABCD',
      'Phetho Nemavhola',
      'Vhulenda Mashamba',
    ]) {
      expect(html).toContain(text);
    }
  });

  it('prints the app logo once, above the app name', () => {
    const html = buildCertificateHtml(viewFor('Thandi Nkosi'));
    expect(html.match(/<img /g)).toHaveLength(1);
    expect(html.indexOf('<img class="logo"')).toBeGreaterThan(-1);
    expect(html.indexOf('<img class="logo"')).toBeLessThan(html.indexOf('<div class="brand">'));
    expect(html).toContain(`.logo { width: calc(var(--u) * ${LOGO_SIZE}); height: calc(var(--u) * ${LOGO_SIZE});`);
  });

  it('carries the logo inside the page, so it still prints when the phone is offline', () => {
    const html = buildCertificateHtml(viewFor('Thandi Nkosi'));
    expect(html).toContain(`src="${LOGO_DATA_URI}"`);
    expect(html).not.toMatch(/<img[^>]+src="https?:/);

    const png = Buffer.from(LOGO_DATA_URI.replace('data:image/png;base64,', ''), 'base64');
    expect(LOGO_DATA_URI.startsWith('data:image/png;base64,')).toBe(true);
    expect(png.toString('latin1', 1, 4)).toBe('PNG');
    expect(png.readUInt32BE(16)).toBe(png.readUInt32BE(20));
    expect(png.readUInt32BE(16)).toBeGreaterThanOrEqual(200);
  });

  it('still prints the logo on a certificate that has no stored score, date or number', () => {
    expect(buildCertificateHtml(viewFor('Thandi', null)).match(/<img class="logo"/g)).toHaveLength(1);
  });

  it('is a complete page, sized as one portrait A4 sheet with no printer margins', () => {
    const html = buildCertificateHtml(viewFor('Thandi'));
    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(CERTIFICATE_PAGE).toEqual({ width: 595, height: 842 });
    expect(html).toMatch(/@page\s*{[^}]*margin:\s*0/);
  });

  it('marks the page with the language the certificate is written in', () => {
    const view = buildCertificateView({ moduleId: '02', record: { ...RECORD, language: 'zu' }, name: 'Thandi', fallbackLanguage: 'en' })!;
    expect(buildCertificateHtml(view)).toContain('<html lang="zu">');
  });

  it('prints a name containing code characters as plain text, so it cannot break or hijack the page', () => {
    const html = buildCertificateHtml(viewFor('<script>alert(1)</script> & "Co"'));
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;Co&quot;');
  });

  it('prints a long name smaller so it is never cut off', () => {
    const size = (html: string) => Number(/class="name" style="font-size: calc\(var\(--u\) \* ([\d.]+)\)/.exec(html)?.[1]);
    expect(size(buildCertificateHtml(viewFor('Thandi Nkosi')))).toBe(25);
    expect(size(buildCertificateHtml(viewFor('Nomvula Thandiwe Mahlangu-Van der Westhuizen')))).toBeLessThan(25);
  });

  it('leaves the score, date and number rows out entirely when they were never recorded', () => {
    const html = buildCertificateHtml(viewFor('Thandi', null));
    expect(html).toContain('Thandi');
    expect(html).not.toContain('Date awarded');
    expect(html).not.toContain('Certificate no.');
    expect(html).not.toContain('null');
    expect(html).not.toContain('undefined');
  });
});
