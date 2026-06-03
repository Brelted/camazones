import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text as NativeText,
  TextInput as NativeTextInput,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { darkPalette, overlay, palette, theme } from '../theme';

const fontFamily = Platform.select({
  ios: 'Avenir Next',
  android: 'sans-serif',
  default: 'System',
});

export function useTheme() {
  return theme;
}

export function Text({ variant, style, children, ...props }) {
  return (
    <NativeText style={[styles.baseText, variantStyles[variant], style]} {...props}>
      {children}
    </NativeText>
  );
}

export function Surface({ children, style }) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

export function HelperText({ visible, children }) {
  if (!visible) {
    return <View style={styles.helperSpace} />;
  }

  return <Text style={styles.helperText}>{children}</Text>;
}

export function LoadingDots({ color = palette.primary, size = 8, label }) {
  const values = useRef([new Animated.Value(0.35), new Animated.Value(0.35), new Animated.Value(0.35)]).current;

  useEffect(() => {
    const animations = values.map((value, index) =>
      Animated.sequence([
        Animated.delay(index * 120),
        Animated.timing(value, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(value, { toValue: 0.35, duration: 220, useNativeDriver: true }),
      ])
    );
    const loop = Animated.loop(Animated.stagger(90, animations));
    loop.start();
    return () => loop.stop();
  }, [values]);

  return (
    <View style={styles.loadingDotsWrap}>
      <View style={styles.loadingDots}>
        {values.map((value, index) => (
          <Animated.View
            key={String(index)}
            style={[
              styles.loadingDot,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                opacity: value,
                transform: [{ translateY: value.interpolate({ inputRange: [0.35, 1], outputRange: [0, -4] }) }],
              },
            ]}
          />
        ))}
      </View>
      {label ? <Text style={[styles.loadingLabel, { color }]}>{label}</Text> : null}
    </View>
  );
}

export function Button({
  mode = 'text',
  onPress,
  loading,
  disabled,
  children,
  buttonColor,
  textColor,
  compact,
  contentStyle,
  style,
}) {
  const darkMode = useSelector((state) => state.settings?.darkMode);
  const colors = darkMode ? darkPalette : palette;
  const contained = mode === 'contained';
  const outlined = mode === 'outlined';
  const backgroundColor = contained ? buttonColor ?? colors.primary : 'transparent';
  const color = textColor ?? (contained ? colors.background : colors.primary);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compactButton,
        contained && { backgroundColor },
        outlined && { borderColor: colors.primary },
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={[styles.buttonContent, contentStyle]}>
        {loading ? <LoadingDots color={color} size={6} /> : <Text style={[styles.buttonText, { color }]}>{children}</Text>}
      </View>
    </Pressable>
  );
}

export function TextInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  editable = true,
  multiline,
  style,
  inputRef,
  ...props
}) {
  const darkMode = useSelector((state) => state.settings?.darkMode);
  const colors = darkMode ? darkPalette : palette;
  const line = darkMode ? darkPalette.line : overlay.line;
  const muted = darkMode ? darkPalette.muted : overlay.muted;

  return (
    <View style={[styles.inputShell, { backgroundColor: colors.surface, borderColor: line }, style]}>
      {label ? <Text style={[styles.inputLabel, { color: muted }]}>{label}</Text> : null}
      <NativeTextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? label}
        placeholderTextColor={muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        multiline={multiline}
        style={[styles.input, { color: colors.text }]}
        {...props}
      />
    </View>
  );
}

TextInput.Icon = function Icon() {
  return null;
};

const variantStyles = StyleSheet.create({
  headlineLarge: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 23,
  },
});

const styles = StyleSheet.create({
  baseText: {
    fontFamily,
    includeFontPadding: false,
    letterSpacing: -0.1,
  },
  surface: {
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 2,
  },
  loadingDotsWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  loadingDots: {
    minHeight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loadingLabel: {
    fontSize: 12,
    fontWeight: '900',
  },
  helperSpace: {
    minHeight: 18,
  },
  helperText: {
    minHeight: 18,
    color: palette.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  button: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  compactButton: {
    minHeight: 34,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.76,
  },
  buttonContent: {
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  buttonText: {
    fontSize: 14,
    fontFamily,
    fontWeight: '900',
    letterSpacing: -0.1,
  },
  inputShell: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: overlay.line,
    borderRadius: 18,
    backgroundColor: palette.background,
    paddingHorizontal: 12,
    paddingTop: 7,
  },
  inputLabel: {
    color: overlay.muted,
    fontSize: 11,
    fontFamily,
    fontWeight: '800',
  },
  input: {
    flex: 1,
    minHeight: 34,
    color: palette.text,
    paddingVertical: 0,
    fontSize: 15,
    fontFamily,
    fontWeight: '700',
  },
});
