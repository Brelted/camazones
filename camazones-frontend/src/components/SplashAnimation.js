import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { palette } from '../theme';

const splash = require('../../assets/splash.png');

export default function SplashAnimation() {
  const pulse = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const shine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1050, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1050, useNativeDriver: true }),
      ])
    );
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1700, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1700, useNativeDriver: true }),
      ])
    );
    const spinLoop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 5200, useNativeDriver: true }));
    const shineLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shine, { toValue: 1, duration: 1350, useNativeDriver: true }),
        Animated.timing(shine, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    pulseLoop.start();
    floatLoop.start();
    spinLoop.start();
    shineLoop.start();
    return () => {
      pulseLoop.stop();
      floatLoop.stop();
      spinLoop.stop();
      shineLoop.stop();
    };
  }, [float, pulse, shine, spin]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.18] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.5] });
  const logoY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
  const logoScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.035] });
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const shineX = shine.interpolate({ inputRange: [0, 1], outputRange: [-170, 170] });
  const loaderScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.34, 1] });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.halo, styles.haloOne, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]} />
      <Animated.View style={[styles.halo, styles.haloTwo, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]} />
      <Animated.View style={[styles.orbit, { transform: [{ rotate }] }]}>
        <View style={[styles.orbitDot, styles.dotOne]} />
        <View style={[styles.orbitDot, styles.dotTwo]} />
        <View style={[styles.orbitDot, styles.dotThree]} />
      </Animated.View>
      <Animated.View style={[styles.logoWrap, { transform: [{ translateY: logoY }, { scale: logoScale }] }]}>
        <Image source={splash} style={styles.splashImage} resizeMode="contain" />
        <Animated.View style={[styles.shine, { transform: [{ translateX: shineX }, { rotate: '18deg' }] }]} />
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
  halo: {
    position: 'absolute',
    borderRadius: 999,
  },
  haloOne: {
    width: 290,
    height: 290,
    borderWidth: 2,
    borderColor: palette.primary,
    backgroundColor: 'rgba(231, 85, 27, 0.09)',
  },
  haloTwo: {
    width: 210,
    height: 210,
    borderWidth: 1,
    borderColor: palette.secondary,
    backgroundColor: 'rgba(47, 58, 86, 0.08)',
  },
  orbit: {
    position: 'absolute',
    width: 308,
    height: 308,
    borderRadius: 154,
  },
  orbitDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotOne: {
    top: 18,
    left: 148,
    backgroundColor: palette.primary,
  },
  dotTwo: {
    bottom: 42,
    right: 46,
    backgroundColor: palette.secondary,
  },
  dotThree: {
    left: 34,
    bottom: 76,
    backgroundColor: palette.khaki,
  },
  logoWrap: {
    width: '82%',
    maxWidth: 350,
    aspectRatio: 1.6,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: 'rgba(250, 234, 203, 0.24)',
    shadowColor: '#1F1F1F',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
  shine: {
    position: 'absolute',
    top: -35,
    width: 58,
    height: '150%',
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
  },
  loader: {
    marginTop: 24,
    width: 154,
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(31,31,31,0.11)',
  },
  loaderBar: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.primary,
  },
});
