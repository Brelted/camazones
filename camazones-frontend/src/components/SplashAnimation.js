import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { palette } from '../theme';

const splash = require('../../assets/splash.png');

export default function SplashAnimation() {
  const pulse = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 950, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 950, useNativeDriver: true }),
      ])
    );
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    );
    pulseLoop.start();
    floatLoop.start();
    return () => {
      pulseLoop.stop();
      floatLoop.stop();
    };
  }, [float, pulse]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.46] });
  const splashY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const glowScale = float.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const loaderScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.28, 1] });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.orb, styles.orangeOrb, { transform: [{ scale: glowScale }] }]} />
      <Animated.View style={[styles.orb, styles.greenOrb, { transform: [{ scale: ringScale }] }]} />
      <Animated.View style={[styles.ring, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]} />
      <Animated.View style={[styles.splashWrap, { transform: [{ translateY: splashY }] }]}>
        <Image source={splash} style={styles.splashImage} resizeMode="contain" />
      </Animated.View>
      <View style={styles.loader}>
        <Animated.View style={[styles.loaderBar, { transform: [{ scaleX: loaderScale }] }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: palette.background,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.24,
  },
  orangeOrb: {
    width: 240,
    height: 240,
    right: -72,
    top: 92,
    backgroundColor: palette.orange,
  },
  greenOrb: {
    width: 220,
    height: 220,
    left: -76,
    bottom: 132,
    backgroundColor: palette.green,
  },
  ring: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 2,
    borderColor: palette.orange,
    backgroundColor: 'rgba(255, 90, 15, 0.07)',
  },
  splashWrap: {
    width: '82%',
    maxWidth: 350,
    aspectRatio: 1.6,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: '#1F1F1F',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
  loader: {
    marginTop: 22,
    width: 146,
    height: 7,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(31,31,31,0.09)',
  },
  loaderBar: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.orange,
  },
});
