import { render } from '@testing-library/react-native';
import React from 'react';

import { BrandLogo } from '@/components/brand-logo';

describe('BrandLogo', () => {
  it('shows the app logo artwork', async () => {
    const { getByTestId } = await render(<BrandLogo size={48} />);
    expect(getByTestId('brand-logo').props.source).toBe(require('../../../assets/images/logo.png'));
  });

  it('is drawn square at the size it is given, without cropping the artwork', async () => {
    const { getByTestId } = await render(<BrandLogo size={72} />);
    const logo = getByTestId('brand-logo');
    expect(logo).toHaveStyle({ width: 72, height: 72 });
    expect(logo.props.resizeMode).toBe('contain');
  });

  it('is announced to a screen reader by the app name', async () => {
    const { getByLabelText } = await render(<BrandLogo size={48} />);
    expect(getByLabelText('CyberAware SA')).toBeTruthy();
  });

  it('can be hidden from a screen reader where the app name is already written next to it', async () => {
    const { getByTestId, queryByLabelText } = await render(<BrandLogo size={48} decorative />);
    expect(getByTestId('brand-logo', { includeHiddenElements: true })).toBeTruthy();
    expect(queryByLabelText('CyberAware SA')).toBeNull();
  });
});
