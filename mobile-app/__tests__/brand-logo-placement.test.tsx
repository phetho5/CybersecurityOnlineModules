import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
  useLocalSearchParams: () => ({}),
}));

import { router } from 'expo-router';

import HomeScreen from '@/app/(tabs)/home';
import LanguageScreen from '@/app/language';
import i18n from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

const initialState = useAppStore.getState();
const all = { includeHiddenElements: true };

beforeEach(async () => {
  jest.clearAllMocks();
  useAppStore.setState({ ...initialState }, true);
  await i18n.changeLanguage('en');
});

afterAll(async () => {
  await i18n.changeLanguage('en');
});

describe('the app logo on the language picker', () => {
  it('is shown once, above the app name', async () => {
    const { getAllByTestId, getByText } = await render(<LanguageScreen />);
    expect(getAllByTestId('brand-logo', all)).toHaveLength(1);
    expect(getByText('CyberAware SA')).toBeTruthy();
  });

  it('does not get in the way of choosing a language', async () => {
    const { getByText } = await render(<LanguageScreen />);
    await fireEvent.press(getByText('isiZulu'));
    expect(useAppStore.getState().language).toBe('zu');
    expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
  });
});

describe('the app logo on Home', () => {
  it('is shown once in the header, next to the greeting', async () => {
    useAppStore.setState({ ...initialState, language: 'en' }, true);
    const { getAllByTestId, getByText } = await render(<HomeScreen />);
    expect(getAllByTestId('brand-logo', all)).toHaveLength(1);
    expect(getByText(i18n.t('greeting'))).toBeTruthy();
  });

  it('is still shown for a student who has not chosen a language yet', async () => {
    useAppStore.setState({ ...initialState, language: null }, true);
    const { getAllByTestId } = await render(<HomeScreen />);
    expect(getAllByTestId('brand-logo', all)).toHaveLength(1);
  });

  it('leaves the language button in the header working', async () => {
    useAppStore.setState({ ...initialState, language: 'nso' }, true);
    await i18n.changeLanguage('nso');
    const { getByText } = await render(<HomeScreen />);
    await fireEvent.press(getByText('NSO'));
    expect(router.push).toHaveBeenCalledWith('/language');
  });
});
