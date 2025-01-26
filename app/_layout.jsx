import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: [
          route.name === 'home' || route.name === 'search'
            ? {
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#ddd',
                height: 60,
                paddingBottom: 5,
              }
            : { display: 'none' }, // Hide the navbar for other routes
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
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" size={size} color={color} />
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
