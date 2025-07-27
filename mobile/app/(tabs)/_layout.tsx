// mobile/app/(tabs)/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import GlobalLoadingOverlay from '../../components/GlobalLoadingOverlay';

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const { isLoaded, isSignedIn } = useAuth();
  const [showGlobalLoading, setShowGlobalLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setShowGlobalLoading(true);
      const timer = setTimeout(() => setShowGlobalLoading(false), 1100);
      return () => clearTimeout(timer);
    } else {
      setShowGlobalLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <>
      {isSignedIn && <GlobalLoadingOverlay visible={showGlobalLoading} />}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#50C898',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#E1E8ED',
              height: 45 + insets.bottom,
          },
          tabBarItemStyle: {
              paddingVertical: 8,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ 
            title: '',
            tabBarIcon: ({color,size}) =>  
            <Feather name="home" color={color} size={size} />
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: '', 
            tabBarIcon: ({color,size}) =>  
            <Feather name="search" color={color} size={size} />
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            title: '',
            tabBarIcon: ({color,size}) =>  
            <Feather name="bell" color={color} size={size} />
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: '',
            tabBarIcon: ({color,size}) =>  
            <Feather name="mail" color={color} size={size} />
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '',
            tabBarIcon: ({color,size}) =>  
            <Feather name="user" color={color} size={size} />
          }}
        />
      </Tabs>
    </>
  );
}

export default TabsLayout;