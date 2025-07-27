
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignOutButton from '@/components/SignOutButton';

const HomeScreen = () => (
  <SafeAreaView className="flex-1" edges={['top']}>
    <Text> HomeScreen </Text>
    <SignOutButton />
  </SafeAreaView>
);



export default HomeScreen;