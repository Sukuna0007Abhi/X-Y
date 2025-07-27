import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';

export default function SSOCallback() {
  const router = useRouter();

  useEffect(() => {
    // You can process tokens here if needed
    // Then redirect to home
    router.replace('/');
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Signing you in...</Text>
    </View>
  );
}