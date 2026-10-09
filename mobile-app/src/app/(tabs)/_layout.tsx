import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/icon';
import { Colors, Fonts } from '@/constants/theme';

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.neutral500,
        tabBarActiveBackgroundColor: Colors.background,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 1,
          borderTopColor: Colors.divider,
          height: 64,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.bodyMedium,
          fontSize: 9,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          fontWeight: '800',
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{ title: t('home'), tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="modules"
        options={{
          title: t('modules'),
          tabBarIcon: ({ color, size }) => <Icon name="layers" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: t('practiceTab'),
          tabBarIcon: ({ color, size }) => <Icon name="shield-checkmark" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color, size }) => <Icon name="person-circle" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
