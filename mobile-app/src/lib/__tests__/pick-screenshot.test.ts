const mockLaunchImageLibraryAsync = jest.fn();

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: (...args: unknown[]) => mockLaunchImageLibraryAsync(...args),
}));

import { pickScreenshot } from '@/lib/pick-screenshot';

describe('pickScreenshot', () => {
  beforeEach(() => {
    mockLaunchImageLibraryAsync.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it('returns the chosen picture with its preview address, image data and file type', async () => {
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///shot.png', base64: 'aGVsbG8=', mimeType: 'image/png' }],
    });
    expect(await pickScreenshot()).toEqual({
      ok: true,
      screenshot: { uri: 'file:///shot.png', base64: 'aGVsbG8=', mimeType: 'image/png' },
    });
  });

  it('asks the phone for still images only, with the image data included', async () => {
    mockLaunchImageLibraryAsync.mockResolvedValue({ canceled: true, assets: null });
    await pickScreenshot();
    const options = mockLaunchImageLibraryAsync.mock.calls[0][0];
    expect(options.mediaTypes).toEqual(['images']);
    expect(options.base64).toBe(true);
    expect(options.allowsMultipleSelection).toBeFalsy();
  });

  it('reports "cancelled" when the student closes the picker without choosing', async () => {
    mockLaunchImageLibraryAsync.mockResolvedValue({ canceled: true, assets: null });
    expect(await pickScreenshot()).toEqual({ ok: false, reason: 'cancelled' });
  });

  it('reports "cancelled" when the picker says it was not cancelled but hands back no picture', async () => {
    mockLaunchImageLibraryAsync.mockResolvedValue({ canceled: false, assets: [] });
    expect(await pickScreenshot()).toEqual({ ok: false, reason: 'cancelled' });
  });

  it('reads the image data out of the preview address on web, where the picker gives no separate copy', async () => {
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'data:image/webp;base64,d2ViZGF0YQ==', base64: null }],
    });
    expect(await pickScreenshot()).toEqual({
      ok: true,
      screenshot: { uri: 'data:image/webp;base64,d2ViZGF0YQ==', base64: 'd2ViZGF0YQ==', mimeType: 'image/webp' },
    });
  });

  it('leaves the file type unset when the phone does not report one', async () => {
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///shot', base64: 'aGVsbG8=' }],
    });
    const result = await pickScreenshot();
    expect(result).toEqual({ ok: true, screenshot: { uri: 'file:///shot', base64: 'aGVsbG8=', mimeType: undefined } });
  });

  it('reports "unreadable" when the picture comes back with no image data at all', async () => {
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///shot.png', base64: null, mimeType: 'image/png' }],
    });
    expect(await pickScreenshot()).toEqual({ ok: false, reason: 'unreadable' });
  });

  it('reports "unreadable" instead of throwing when the picker itself fails (e.g. access refused)', async () => {
    mockLaunchImageLibraryAsync.mockRejectedValue(new Error('Missing photo library permission'));
    expect(await pickScreenshot()).toEqual({ ok: false, reason: 'unreadable' });
  });
});
