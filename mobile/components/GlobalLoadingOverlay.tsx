import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface GlobalLoadingOverlayProps {
  visible: boolean;
}

const GlobalLoadingOverlay: React.FC<GlobalLoadingOverlayProps> = ({ visible }) => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1100,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.stopAnimation();
    }
  }, [visible]);

  if (!visible) return null;

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.fullScreenOverlay} pointerEvents="box-none">
      <View style={styles.centeredContent}>
        <Animated.View style={[styles.spinnerCircle, { transform: [{ rotate: spin }] }]}> 
          <Feather name="zap" size={70} color="#1DA1F2" />
        </Animated.View>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5FD',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1DA1F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  loadingText: {
    color: '#1A1A1A',
    marginTop: 28,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1.2,
    fontFamily: 'System',
  },
});

export default GlobalLoadingOverlay;
