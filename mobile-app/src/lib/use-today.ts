import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { toLocalDateKey } from '@/lib/streak';

/**
 * Today's date (YYYY-MM-DD) on the phone's own clock. Checked again whenever the app comes back to
 * the foreground, so an app left open overnight notices that a new day has started.
 */
export function useToday(): string {
  const [today, setToday] = useState(() => toLocalDateKey(new Date()));

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setToday(toLocalDateKey(new Date()));
    });
    return () => subscription.remove();
  }, []);

  return today;
}
