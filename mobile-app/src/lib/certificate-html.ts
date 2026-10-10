import { Colors } from '@/constants/theme';
import { certificateNameScale, type CertificateView } from '@/lib/certificate';
import { LOGO_DATA_URI } from '@/lib/logo-data-uri';

/** One portrait A4 sheet, in the 72-per-inch points expo-print measures pages in. */
export const CERTIFICATE_PAGE = { width: 595, height: 842 } as const;

/** Width of the seal on the certificate's 360-unit grid. Its own measurements are drawn for a width of 76. */
export const SEAL_SIZE = 70;

/** Width and height of the app logo above the app name, on the same 360-unit grid. */
export const LOGO_SIZE = 30;

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (text: string) => text.replace(/[&<>"']/g, (c) => ESCAPES[c]);

const detail = (item: { label: string; value: string } | null, extra = '', small = '') =>
  item
    ? `<div class="detail"><div class="label">${esc(item.label)}</div><div class="value ${extra}">${esc(item.value)}</div>${
        small ? `<div class="small">${esc(small)}</div>` : ''
      }</div>`
    : '';

/**
 * The certificate as a self-contained page for the PDF. It mirrors `components/certificate.tsx`
 * measure for measure (both are drawn on a 360-unit-wide grid), so change the two together.
 */
export function buildCertificateHtml(view: CertificateView): string {
  const details = [
    detail(view.score, '', view.score?.passMark),
    detail(view.date),
    detail(view.number, 'number'),
  ].join('');

  const nameScale = certificateNameScale(view.name);
  const nameStyle = `font-size: calc(var(--u) * ${+(25 * nameScale).toFixed(2)}); line-height: calc(var(--u) * ${+(30 * nameScale).toFixed(2)})`;

  return `<!DOCTYPE html>
<html lang="${esc(view.language)}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=${CERTIFICATE_PAGE.width}" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800&display=swap" />
<style>
  @page { size: ${CERTIFICATE_PAGE.width}px ${CERTIFICATE_PAGE.height}px; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { width: ${CERTIFICATE_PAGE.width}px; height: ${CERTIFICATE_PAGE.height}px; }
  body { --u: ${(CERTIFICATE_PAGE.width / 360).toFixed(4)}px; --s: calc(var(--u) * ${SEAL_SIZE} / 76); font-family: 'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif; color: ${Colors.text}; }
  .paper { width: 100%; height: 100%; background: ${Colors.paper}; padding: calc(var(--u) * 12); overflow: hidden; }
  .frame { position: relative; width: 100%; height: 100%; border: calc(var(--u) * 1.5) solid ${Colors.text}; padding: calc(var(--u) * 3); }
  .corner { position: absolute; width: calc(var(--u) * 7); height: calc(var(--u) * 7); background: ${Colors.accent}; }
  .tl { top: calc(var(--u) * -4); left: calc(var(--u) * -4); } .tr { top: calc(var(--u) * -4); right: calc(var(--u) * -4); }
  .bl { bottom: calc(var(--u) * -4); left: calc(var(--u) * -4); } .br { bottom: calc(var(--u) * -4); right: calc(var(--u) * -4); }
  .inner { width: 100%; height: 100%; border: calc(var(--u) * 0.5) solid ${Colors.neutral400}; padding: calc(var(--u) * 24) calc(var(--u) * 20) calc(var(--u) * 18);
    display: flex; flex-direction: column; align-items: center; justify-content: space-between; text-align: center; }
  .group { display: flex; flex-direction: column; align-items: center; width: 100%; }
  .logo { width: calc(var(--u) * ${LOGO_SIZE}); height: calc(var(--u) * ${LOGO_SIZE}); display: block; }
  .brand { margin-top: calc(var(--u) * 6); font-weight: 800; font-size: calc(var(--u) * 9); letter-spacing: calc(var(--u) * 2.4); text-transform: uppercase; color: ${Colors.accent700}; }
  .title { font-weight: 800; font-size: calc(var(--u) * 23); line-height: calc(var(--u) * 26); margin-top: calc(var(--u) * 8); }
  .rule { width: calc(var(--u) * 40); height: calc(var(--u) * 2); background: ${Colors.accent}; margin-top: calc(var(--u) * 12); }
  .caps { font-weight: 600; font-size: calc(var(--u) * 8); letter-spacing: calc(var(--u) * 1.4); text-transform: uppercase; color: ${Colors.textMuted}; }
  .name { font-weight: 800; margin-top: calc(var(--u) * 8); overflow-wrap: anywhere; }
  .underline { width: 70%; height: calc(var(--u) * 1); background: ${Colors.text}; margin: calc(var(--u) * 8) 0 calc(var(--u) * 10); }
  .completed { font-size: calc(var(--u) * 10); color: ${Colors.textMuted}; }
  .module { font-weight: 800; font-size: calc(var(--u) * 17); line-height: calc(var(--u) * 21); margin-top: calc(var(--u) * 4); }
  .seal { position: relative; width: calc(var(--s) * 76); height: calc(var(--s) * 98); }
  .tail { position: absolute; top: calc(var(--s) * 46); width: calc(var(--s) * 16); height: calc(var(--s) * 46); background: ${Colors.accent700};
    clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%); }
  .tail.left { left: calc(var(--s) * 18); transform: rotate(14deg); } .tail.right { right: calc(var(--s) * 18); transform: rotate(-14deg); }
  .burst { position: absolute; top: calc(var(--s) * 11.4); left: calc(var(--s) * 11.4); width: calc(var(--s) * 53.2); height: calc(var(--s) * 53.2);
    background: ${Colors.accent}; border-radius: calc(var(--s) * 6); }
  .b2 { transform: rotate(30deg); } .b3 { transform: rotate(60deg); }
  .ring { position: absolute; top: calc(var(--s) * 14.5); left: calc(var(--s) * 14.5); width: calc(var(--s) * 47); height: calc(var(--s) * 47);
    border: calc(var(--s) * 1) solid rgba(255, 255, 255, 0.75); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .ring svg { width: calc(var(--s) * 26); height: calc(var(--s) * 26); }
  .badge { font-weight: 800; font-size: calc(var(--u) * 9); letter-spacing: calc(var(--u) * 1.6); text-transform: uppercase; color: ${Colors.accent700}; margin-top: calc(var(--u) * 6); }
  .details { display: flex; width: 100%; margin-top: calc(var(--u) * 12); }
  .detail { flex: 1; padding: 0 calc(var(--u) * 2); }
  .label { font-weight: 600; font-size: calc(var(--u) * 6.5); letter-spacing: calc(var(--u) * 1); text-transform: uppercase; color: ${Colors.textMuted}; }
  .value { font-weight: 600; font-size: calc(var(--u) * 11); margin-top: calc(var(--u) * 3); }
  .value.number { font-size: calc(var(--u) * 8); line-height: calc(var(--u) * 13); }
  .small { font-size: calc(var(--u) * 6.5); color: ${Colors.textMuted}; margin-top: calc(var(--u) * 1); }
  .footer { border-top: calc(var(--u) * 0.5) solid ${Colors.neutral400}; padding-top: calc(var(--u) * 10); margin-top: calc(var(--u) * 10); }
  .researchers { font-weight: 600; font-size: calc(var(--u) * 10); margin-top: calc(var(--u) * 3); }
  .project { font-size: calc(var(--u) * 7); color: ${Colors.textMuted}; margin-top: calc(var(--u) * 4); }
</style>
</head>
<body>
<div class="paper"><div class="frame">
  <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
  <div class="inner">
    <div class="group">
      <img class="logo" alt="" src="${LOGO_DATA_URI}" />
      <div class="brand">CyberAware SA</div>
      <div class="title">${esc(view.title)}</div>
      <div class="rule"></div>
    </div>
    <div class="group">
      <div class="caps">${esc(view.presentedTo)}</div>
      <div class="name" style="${nameStyle}">${esc(view.name)}</div>
      <div class="underline"></div>
      <div class="completed">${esc(view.completed)}</div>
      <div class="module">${esc(view.moduleTitle)}</div>
    </div>
    <div class="group">
      <div class="seal">
        <div class="tail left"></div><div class="tail right"></div>
        <div class="burst"></div><div class="burst b2"></div><div class="burst b3"></div>
        <div class="ring"><svg viewBox="0 0 24 24"><path fill="#ffffff" d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z"/><path fill="none" stroke="${Colors.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m8.4 12.2 2.6 2.6 4.8-5.2"/></svg></div>
      </div>
      <div class="badge">${esc(view.badgeName)}</div>
    </div>
    <div class="group">
      ${details ? `<div class="details">${details}</div>` : ''}
      <div class="group footer">
        <div class="label">${esc(view.researchersLabel)}</div>
        <div class="researchers">${view.researchers.map(esc).join(' &nbsp;·&nbsp; ')}</div>
        <div class="project">${esc(view.project)}</div>
      </div>
    </div>
  </div>
</div></div>
</body>
</html>`;
}
