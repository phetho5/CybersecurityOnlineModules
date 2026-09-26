import { Redirect } from 'expo-router';

import { useAppStore } from '@/store/useAppStore';

export default function Index() {
  const language = useAppStore((s) => s.language);
  return <Redirect href={language ? '/(tabs)/home' : '/language'} />;
}
