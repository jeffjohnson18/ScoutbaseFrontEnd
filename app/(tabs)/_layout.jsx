/**
 * Tab Navigation Layout Component
 * Configures and manages the bottom tab navigation structure of the application.
 * @module TabLayout
 */

import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Layout Component
 * Defines the tab-based navigation structure and styling for the main application flow.
 * Includes tabs for Home, Search Coach, Search Athlete, and Profile sections.
 * @component
 */
export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        // Configure tab bar visibility and styling based on route
        tabBarStyle: [
          // Show tab bar only for main navigation routes
          route.name === 'home' || 
          route.name === 'searchcoach' || 
          route.name === 'searchathlete' || 
          route.name === 'profile'
            ? {
                // Tab bar styling when visible
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#ddd',
                height: 60,
                paddingBottom: 5,
              }
            : { 
                // Hide tab bar for other routes
                display: 'none' 
              },
        ],
        // Tab bar colors for active and inactive states
        tabBarActiveTintColor: '#1e90ff',    // Active tab color
        tabBarInactiveTintColor: '#666',     // Inactive tab color
        headerShown: false,                  // Hide header for all tab screens
      })}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Search Coach Tab */}
      <Tabs.Screen
        name="searchcoach"
        options={{
          title: 'Search Coach',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-search" size={size} color={color} />
          ),
        }}
      />

      {/* Search Athlete Tab */}
      <Tabs.Screen
        name="searchathlete"
        options={{
          title: 'Search Athlete',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-search" size={size} color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
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
