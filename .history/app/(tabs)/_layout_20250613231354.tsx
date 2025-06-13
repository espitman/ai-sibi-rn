import BlurTabBarBackground from '@/components/ui/TabBarBackground.ios';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
      tabBarInactiveTintColor: colorScheme === 'dark' ? '#666' : '#999',
      tabBarBackground: () => <BlurTabBarBackground />,
      tabBarStyle: {
        position: 'absolute',
        borderTopWidth: 0,
        elevation: 0,
        height: 60,
        backgroundColor: 'transparent',
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
