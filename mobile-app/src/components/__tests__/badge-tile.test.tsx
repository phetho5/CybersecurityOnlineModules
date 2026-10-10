import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { BadgeTile } from '@/components/badge-tile';
import { BADGES } from '@/data/badges';
import i18n from '@/i18n';

const badge = (id: string, earned: boolean) => ({ ...BADGES.find((b) => b.id === id)!, earned });

describe('BadgeTile', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  afterAll(async () => {
    await i18n.changeLanguage('en');
  });

  it.each(BADGES.map((b) => b.id))('shows the picture and name of "%s"', async (id) => {
    const { getByTestId, getByText } = await render(<BadgeTile badge={badge(id, true)} />);
    expect(getByTestId(`badge-image-${id}`).props.source).toBe(badge(id, true).image);
    expect(getByText(i18n.t(`badgeName_${id}`))).toBeTruthy();
  });

  it('can be tapped once earned, and says so to a screen reader', async () => {
    const onPress = jest.fn();
    const { getByRole } = await render(<BadgeTile badge={badge('first-steps', true)} onPress={onPress} />);
    await fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is not a button while the badge is still locked, so a tap cannot replay something not earned', async () => {
    const onPress = jest.fn();
    const { queryByRole, getByTestId } = await render(<BadgeTile badge={badge('first-steps', false)} onPress={onPress} />);
    expect(queryByRole('button')).toBeNull();
    // The tile on screen carries no tap handler at all while locked.
    expect(getByTestId('badge-tile-first-steps').props.onPress).toBeUndefined();
    expect(getByTestId('badge-tile-first-steps').props.onClick).toBeUndefined();
  });

  it('is not a button when nothing is wired to it, even if earned', async () => {
    const { queryByRole } = await render(<BadgeTile badge={badge('first-steps', true)} />);
    expect(queryByRole('button')).toBeNull();
  });

  it('tells the student how to earn a badge they do not have yet', async () => {
    const { getByText } = await render(<BadgeTile badge={badge('first-steps', false)} />);
    expect(getByText('Finish your first lesson')).toBeTruthy();
  });

  it('drops the how-to-earn line once the badge is earned', async () => {
    const { queryByText, getByText } = await render(<BadgeTile badge={badge('first-steps', true)} />);
    expect(getByText('First Steps')).toBeTruthy();
    expect(queryByText('Finish your first lesson')).toBeNull();
  });

  it('fades a badge that is not earned and shows an earned one at full strength', async () => {
    const locked = await render(<BadgeTile badge={badge('streak-7', false)} />);
    expect(locked.getByTestId('badge-image-streak-7')).toHaveStyle({ opacity: 0.3 });
    const earned = await render(<BadgeTile badge={badge('streak-7', true)} />);
    expect(earned.getByTestId('badge-image-streak-7')).toHaveStyle({ opacity: 1 });
  });

  it('says whether the badge is earned to a screen reader, not by picture alone', async () => {
    const locked = await render(<BadgeTile badge={badge('popia-basics', false)} />);
    expect(locked.getByLabelText('POPIA Aware. Finish all three POPIA lessons')).toBeTruthy();
    const earned = await render(<BadgeTile badge={badge('popia-basics', true)} />);
    expect(earned.getByLabelText('POPIA Aware. Badge earned')).toBeTruthy();
  });

  it('shows the name and the how-to-earn line in the chosen language', async () => {
    await i18n.changeLanguage('zu');
    const { getByText, queryByText } = await render(<BadgeTile badge={badge('cyber-graduate', false)} />);
    expect(getByText(i18n.t('badgeName_cyber-graduate', { lng: 'zu' }))).toBeTruthy();
    expect(getByText(i18n.t('badgeHow_cyber-graduate', { lng: 'zu' }))).toBeTruthy();
    expect(queryByText('Cyber Aware Graduate')).toBeNull();
    expect(queryByText('Complete all three modules')).toBeNull();
  });
});
