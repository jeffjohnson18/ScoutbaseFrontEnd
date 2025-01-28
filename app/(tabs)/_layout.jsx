import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: [
          route.name === 'home' || route.name === 'searchcoach' || route.name === 'searchathlete' || route.name === 'profile'
            ? {
              backgroundColor: '#ffffff',
              borderTopWidth: 1,
              borderTopColor: '#ddd',
              height: 60,
              paddingBottom: 5,
            }
            : { display: 'none' },
        ],
        tabBarActiveTintColor: '#1e90ff',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="searchcoach"
        options={{
          title: 'Search Coach',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="searchathlete"
        options={{
          title: 'Search Athlete',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
