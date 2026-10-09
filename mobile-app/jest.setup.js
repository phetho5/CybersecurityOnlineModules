// Fallback so importing the real supabase client module (e.g. via jest.requireActual) never
// throws in tests just because a local .env isn't present in this environment.
process.env.EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://test.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key';
process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || 'test-deepseek-key';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Screens and components read their text through react-i18next. Initialise it for every test file
// so a component test sees real English text rather than raw key names, exactly as the app does.
require('./src/i18n');
