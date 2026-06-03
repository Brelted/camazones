import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { palette } from '../theme';

export default function AnimatedBackdrop({ colors = palette, darkMode = false }) {
  const drift = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const driftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 5200, useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 5200, useNativeDriver: true }),
      ])
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 2600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 2600, useNativeDriver: true }),
      ])
    );

    driftLoop.start();
    pulseLoop.start();
    return () => {
      driftLoop.stop();
      pulseLoop.stop();
    };
  }, [drift, pulse]);

  const translateY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, 34] });
  const translateX = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -26] });
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.08] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [darkMode ? 0.08 : 0.16, darkMode ? 0.16 : 0.28] });
  const primaryGlow = darkMode ? colors.secondary ?? palette.khaki : colors.primary;
  const secondaryGlow = darkMode ? 'rgba(250, 234, 203, 0.22)' : colors.secondary ?? palette.secondary;
  const softGlow = darkMode ? 'rgba(208, 169, 104, 0.18)' : colors.khaki ?? palette.khaki;

  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Animated.View
        style={[
          styles.orb,
          styles.primaryOrb,
          { backgroundColor: primaryGlow, opacity, transform: [{ translateY }, { scale }] },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          styles.secondaryOrb,
          { backgroundColor: secondaryGlow, opacity, transform: [{ translateX }, { scale }] },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          styles.softOrb,
          { backgroundColor: softGlow, opacity: darkMode ? 0.12 : 0.22, transform: [{ translateY }] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
  },
  primaryOrb: {
    top: -52,
    right: -54,
  },
  secondaryOrb: {
    top: 238,
    left: -72,
  },
  softOrb: {
    width: 130,
    height: 130,
    borderRadius: 65,
    bottom: 86,
    right: -58,
  },
});
