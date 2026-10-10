import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AccessibilityInfo, Animated, BackHandler } from 'react-native';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockPush(...args), replace: jest.fn(), back: jest.fn() },
}));

import { BadgeCelebration } from '@/components/badge-celebration';
import i18n from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

const initialState = useAppStore.getState();

describe('BadgeCelebration', () => {
  let reduceMotion: jest.SpyInstance;

  beforeEach(async () => {
    useAppStore.setState({ ...initialState, language: 'en' }, true);
    await i18n.changeLanguage('en');
    mockPush.mockClear();
    reduceMotion = jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  });

  afterEach(() => jest.restoreAllMocks());

  afterAll(async () => {
    await i18n.changeLanguage('en');
  });

  describe('what it shows', () => {
    it('shows nothing when no badge has just been earned', async () => {
      const { queryByTestId } = await render(<BadgeCelebration />);
      expect(queryByTestId('badge-celebration')).toBeNull();
    });

    it('covers the whole screen and puts the badge in the middle of it, not in a strip at the top', async () => {
      useAppStore.setState({ badgeAnnouncements: ['first-steps'] });
      const { getByTestId } = await render(<BadgeCelebration />);
      expect(getByTestId('badge-celebration')).toHaveStyle({
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
      });
    });

    it('shows the badge large, with its name and a congratulation', async () => {
      useAppStore.setState({ earnedBadgeIds: ['first-steps'], badgeAnnouncements: ['first-steps'] });
      const { getByText, getByTestId } = await render(<BadgeCelebration />);
      expect(getByText('Badge earned')).toBeTruthy();
      expect(getByText('First Steps')).toBeTruthy();
      expect(getByText('Well done — this one is yours.')).toBeTruthy();
      const image = getByTestId('badge-image-first-steps');
      expect(image.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ width: 168, height: 168 })]));
    });

    it('appears as soon as a lesson earns a badge, without the screen being reopened', async () => {
      const { queryByTestId, findByText } = await render(<BadgeCelebration />);
      expect(queryByTestId('badge-celebration')).toBeNull();
      await act(async () => {
        useAppStore.getState().completeLesson('02', 1);
      });
      expect(await findByText('First Steps')).toBeTruthy();
    });

    it('celebrates a badge earned by passing a final assessment too', async () => {
      const { findByText } = await render(<BadgeCelebration />);
      await act(async () => {
        useAppStore.getState().completeModule('02', 'scam-spotter', 80);
      });
      expect(await findByText('Scam Spotter')).toBeTruthy();
    });

    it('is announced to a screen reader and holds its focus while it is up', async () => {
      useAppStore.setState({ badgeAnnouncements: ['first-steps'] });
      const { getByTestId } = await render(<BadgeCelebration />);
      const overlay = getByTestId('badge-celebration');
      expect(overlay.props.accessibilityViewIsModal).toBe(true);
      expect(overlay.props.accessibilityLiveRegion).toBe('assertive');
    });

    it('is written in the chosen language', async () => {
      await i18n.changeLanguage('nso');
      useAppStore.setState({ language: 'nso', badgeAnnouncements: ['first-steps'] });
      const { getByText, queryByText } = await render(<BadgeCelebration />);
      expect(getByText(i18n.t('badgeEarned', { lng: 'nso' }))).toBeTruthy();
      expect(getByText(i18n.t('badgeName_first-steps', { lng: 'nso' }))).toBeTruthy();
      expect(getByText(i18n.t('badgeCongrats', { lng: 'nso' }))).toBeTruthy();
      expect(getByText(i18n.t('badgeSeeMine', { lng: 'nso' }))).toBeTruthy();
      expect(getByText(i18n.t('badgeKeepGoing', { lng: 'nso' }))).toBeTruthy();
      expect(queryByText('First Steps')).toBeNull();
      expect(queryByText('See my badges')).toBeNull();
    });

    it('skips an id it has no badge for rather than showing an empty celebration or getting stuck', async () => {
      useAppStore.setState({ badgeAnnouncements: ['no-such-badge', 'first-steps'] });
      const { findByText, queryByText } = await render(<BadgeCelebration />);
      expect(await findByText('First Steps')).toBeTruthy();
      expect(queryByText(/badgeName_/)).toBeNull();
    });
  });

  describe('the entrance', () => {
    it('animates in: the badge springs into place and the rest follows', async () => {
      const spring = jest.spyOn(Animated, 'spring');
      const timing = jest.spyOn(Animated, 'timing');
      useAppStore.setState({ badgeAnnouncements: ['first-steps'] });
      await render(<BadgeCelebration />);
      await waitFor(() => expect(spring).toHaveBeenCalled());
      expect(timing).toHaveBeenCalled();
    });

    it('has the burst and the sparkles around the badge', async () => {
      useAppStore.setState({ badgeAnnouncements: ['first-steps'] });
      const { getByTestId, getAllByTestId } = await render(<BadgeCelebration />);
      expect(getByTestId('badge-celebration-burst')).toBeTruthy();
      expect(getAllByTestId('badge-celebration-sparkle').length).toBeGreaterThanOrEqual(8);
    });

    it('plays the entrance again for the next badge, not just swapping the picture', async () => {
      const spring = jest.spyOn(Animated, 'spring');
      useAppStore.setState({ badgeAnnouncements: ['popia-basics', 'cyber-graduate'] });
      const { getByText } = await render(<BadgeCelebration />);
      await waitFor(() => expect(spring).toHaveBeenCalled());
      const before = spring.mock.calls.length;

      await fireEvent.press(getByText('Keep going'));
      expect(getByText('Cyber Aware Graduate')).toBeTruthy();
      await waitFor(() => expect(spring.mock.calls.length).toBeGreaterThan(before));
    });

    it('skips all movement for a student who has turned on "reduce motion", and still shows the badge', async () => {
      reduceMotion.mockResolvedValue(true);
      const spring = jest.spyOn(Animated, 'spring');
      const timing = jest.spyOn(Animated, 'timing');
      const loop = jest.spyOn(Animated, 'loop');
      useAppStore.setState({ badgeAnnouncements: ['first-steps'] });
      const { getByText, getByTestId } = await render(<BadgeCelebration />);
      await waitFor(() => expect(reduceMotion).toHaveBeenCalled());
      await act(async () => {});

      expect(spring).not.toHaveBeenCalled();
      expect(timing).not.toHaveBeenCalled();
      expect(loop).not.toHaveBeenCalled();
      expect(getByText('First Steps')).toBeTruthy();
      expect(getByTestId('badge-image-first-steps')).toBeTruthy();
    });

    it('still shows the badge if the phone cannot say whether motion is reduced', async () => {
      reduceMotion.mockRejectedValue(new Error('unavailable'));
      const spring = jest.spyOn(Animated, 'spring');
      useAppStore.setState({ badgeAnnouncements: ['first-steps'] });
      const { getByText } = await render(<BadgeCelebration />);
      await waitFor(() => expect(spring).toHaveBeenCalled());
      expect(getByText('First Steps')).toBeTruthy();
    });

    it('stops its animations when it closes, leaving nothing running behind the app', async () => {
      const stop = jest.fn();
      jest.spyOn(Animated, 'loop').mockReturnValue({ start: jest.fn(), stop, reset: jest.fn() } as unknown as Animated.CompositeAnimation);
      useAppStore.setState({ badgeAnnouncements: ['first-steps'] });
      const { getByText } = await render(<BadgeCelebration />);
      await waitFor(() => expect(Animated.loop).toHaveBeenCalled());
      await fireEvent.press(getByText('Keep going'));
      expect(stop).toHaveBeenCalled();
    });
  });

  describe('replayed from Profile', () => {
    it('plays the same celebration, with the same entrance, for a badge tapped on Profile', async () => {
      const spring = jest.spyOn(Animated, 'spring');
      useAppStore.setState({ earnedBadgeIds: ['scam-spotter'] });
      const { queryByTestId, findByText, getByTestId, getAllByTestId } = await render(<BadgeCelebration />);
      expect(queryByTestId('badge-celebration')).toBeNull();

      await act(async () => {
        useAppStore.getState().replayBadge('scam-spotter');
      });
      expect(await findByText('Scam Spotter')).toBeTruthy();
      expect(getByTestId('badge-image-scam-spotter')).toBeTruthy();
      expect(getByTestId('badge-celebration-burst')).toBeTruthy();
      expect(getAllByTestId('badge-celebration-sparkle').length).toBeGreaterThanOrEqual(8);
      await waitFor(() => expect(spring).toHaveBeenCalled());
    });

    it('offers one way out, "Back", since the student is already looking at their badges', async () => {
      useAppStore.setState({ earnedBadgeIds: ['first-steps'], badgeReplayId: 'first-steps' });
      const { getByText, queryByText, queryByTestId } = await render(<BadgeCelebration />);
      expect(queryByText('See my badges')).toBeNull();
      expect(queryByText('Keep going')).toBeNull();
      await fireEvent.press(getByText('Back'));
      expect(queryByTestId('badge-celebration')).toBeNull();
      expect(useAppStore.getState().badgeReplayId).toBeNull();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('plays again when the same badge is tapped a second time', async () => {
      const spring = jest.spyOn(Animated, 'spring');
      useAppStore.setState({ earnedBadgeIds: ['first-steps'], badgeReplayId: 'first-steps' });
      const { getByText, findByText } = await render(<BadgeCelebration />);
      await waitFor(() => expect(spring).toHaveBeenCalled());
      const before = spring.mock.calls.length;
      await fireEvent.press(getByText('Back'));

      await act(async () => {
        useAppStore.getState().replayBadge('first-steps');
      });
      expect(await findByText('First Steps')).toBeTruthy();
      await waitFor(() => expect(spring.mock.calls.length).toBeGreaterThan(before));
    });

    it('lets a newly earned badge go first, then shows the replay', async () => {
      useAppStore.setState({ earnedBadgeIds: ['first-steps', 'popia-basics'], badgeReplayId: 'first-steps', badgeAnnouncements: ['popia-basics'] });
      const { getByText, queryByText } = await render(<BadgeCelebration />);
      expect(getByText('POPIA Aware')).toBeTruthy();
      expect(queryByText('First Steps')).toBeNull();
      await fireEvent.press(getByText('Keep going'));
      expect(getByText('First Steps')).toBeTruthy();
      expect(getByText('Back')).toBeTruthy();
    });

    it('closes on the Android back button', async () => {
      const addListener = jest.spyOn(BackHandler, 'addEventListener').mockReturnValue({ remove: jest.fn() });
      useAppStore.setState({ earnedBadgeIds: ['first-steps'], badgeReplayId: 'first-steps' });
      const { queryByTestId } = await render(<BadgeCelebration />);
      const onBack = addListener.mock.calls[0][1] as () => boolean;
      await act(async () => {
        onBack();
      });
      expect(queryByTestId('badge-celebration')).toBeNull();
      expect(useAppStore.getState().badgeReplayId).toBeNull();
    });

    it('shows nothing, and clears itself, for a replay id the app has no badge for', async () => {
      useAppStore.setState({ badgeReplayId: 'no-such-badge' });
      const { queryByTestId } = await render(<BadgeCelebration />);
      await waitFor(() => expect(useAppStore.getState().badgeReplayId).toBeNull());
      expect(queryByTestId('badge-celebration')).toBeNull();
    });

    it('respects "reduce motion" on a replay too', async () => {
      reduceMotion.mockResolvedValue(true);
      const spring = jest.spyOn(Animated, 'spring');
      useAppStore.setState({ earnedBadgeIds: ['first-steps'], badgeReplayId: 'first-steps' });
      const { getByText } = await render(<BadgeCelebration />);
      await waitFor(() => expect(reduceMotion).toHaveBeenCalled());
      await act(async () => {});
      expect(spring).not.toHaveBeenCalled();
      expect(getByText('First Steps')).toBeTruthy();
    });

    it('labels its button in the chosen language', async () => {
      await i18n.changeLanguage('zu');
      useAppStore.setState({ language: 'zu', earnedBadgeIds: ['first-steps'], badgeReplayId: 'first-steps' });
      const { getByText, queryByText } = await render(<BadgeCelebration />);
      expect(getByText(i18n.t('back', { lng: 'zu' }))).toBeTruthy();
      expect(queryByText('Back')).toBeNull();
    });
  });

  describe('closing it', () => {
    it('stays until the student closes it, then goes away', async () => {
      useAppStore.setState({ badgeAnnouncements: ['first-steps'] });
      const { getByText, queryByTestId } = await render(<BadgeCelebration />);
      await fireEvent.press(getByText('Keep going'));
      expect(queryByTestId('badge-celebration')).toBeNull();
      expect(useAppStore.getState().badgeAnnouncements).toEqual([]);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('never takes the badge away when it is closed', async () => {
      useAppStore.setState({ earnedBadgeIds: ['first-steps'], badgeAnnouncements: ['first-steps'] });
      const { getByText } = await render(<BadgeCelebration />);
      await fireEvent.press(getByText('Keep going'));
      expect(useAppStore.getState().earnedBadgeIds).toEqual(['first-steps']);
    });

    it('shows two badges earned at once one after the other, not one on top of the other', async () => {
      useAppStore.setState({ badgeAnnouncements: ['popia-basics', 'cyber-graduate'] });
      const { getByText, queryByText, queryByTestId } = await render(<BadgeCelebration />);
      expect(getByText('POPIA Aware')).toBeTruthy();
      expect(queryByText('Cyber Aware Graduate')).toBeNull();
      await fireEvent.press(getByText('Keep going'));
      expect(getByText('Cyber Aware Graduate')).toBeTruthy();
      expect(queryByText('POPIA Aware')).toBeNull();
      await fireEvent.press(getByText('Keep going'));
      expect(queryByTestId('badge-celebration')).toBeNull();
    });

    it('opens the badges on Profile from "See my badges", and closes itself', async () => {
      useAppStore.setState({ badgeAnnouncements: ['streak-7'] });
      const { getByText, queryByTestId } = await render(<BadgeCelebration />);
      await fireEvent.press(getByText('See my badges'));
      expect(mockPush).toHaveBeenCalledWith('/(tabs)/profile');
      expect(queryByTestId('badge-celebration')).toBeNull();
    });

    it('closes one badge, not two, when a button is double-tapped', async () => {
      useAppStore.setState({ badgeAnnouncements: ['popia-basics', 'cyber-graduate'] });
      const { getByText } = await render(<BadgeCelebration />);
      const button = getByText('Keep going');
      await act(async () => {
        fireEvent.press(button);
        fireEvent.press(button);
      });
      expect(useAppStore.getState().badgeAnnouncements).toEqual(['cyber-graduate']);
    });

    it('closes on the Android back button instead of leaving the screen behind it', async () => {
      const remove = jest.fn();
      const addListener = jest.spyOn(BackHandler, 'addEventListener').mockReturnValue({ remove });
      useAppStore.setState({ badgeAnnouncements: ['first-steps'] });
      const { queryByTestId } = await render(<BadgeCelebration />);

      const onBack = addListener.mock.calls[0][1] as () => boolean;
      let handled = false;
      await act(async () => {
        handled = onBack();
      });
      expect(handled).toBe(true);
      expect(queryByTestId('badge-celebration')).toBeNull();
      expect(remove).toHaveBeenCalled();
    });

    it('does not take over the back button when there is nothing to celebrate', async () => {
      const addListener = jest.spyOn(BackHandler, 'addEventListener');
      await render(<BadgeCelebration />);
      expect(addListener).not.toHaveBeenCalled();
    });

    it('blocks taps on the screen behind it, so a stray tap cannot change the lesson underneath', async () => {
      useAppStore.setState({ badgeAnnouncements: ['first-steps'] });
      const { getByTestId } = await render(<BadgeCelebration />);
      expect(getByTestId('badge-celebration').props.pointerEvents ?? 'auto').toBe('auto');
    });
  });
});
