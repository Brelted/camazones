import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text as NativeText,
  TextInput as NativeTextInput,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { darkPalette, overlay, palette, theme } from '../theme';

export function useTheme() {
  return theme;
}

export function Text({ variant, style, children, ...props }) {
  return (
    <NativeText style={[variantStyles[variant], style]} {...props}>
      {children}
    </NativeText>
  );
}

export function Surface({ children, style }) {
  return <View style={style}>{children}</View>;
}

export function HelperText({ visible, children }) {
  if (!visible) {
    return <View style={styles.helperSpace} />;
  }

  return <Text style={styles.helperText}>{children}</Text>;
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
        {loading ? <ActivityIndicator size="small" color={color} /> : <Text style={[styles.buttonText, { color }]}>{children}</Text>}
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
}) {
  const darkMode = useSelector((state) => state.settings?.darkMode);
  const colors = darkMode ? darkPalette : palette;
  const line = darkMode ? darkPalette.line : overlay.line;
  const muted = darkMode ? darkPalette.muted : overlay.muted;

  return (
    <View style={[styles.inputShell, { backgroundColor: colors.surface, borderColor: line }, style]}>
      {label ? <Text style={[styles.inputLabel, { color: muted }]}>{label}</Text> : null}
      <NativeTextInput
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
    borderRadius: 8,
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
    fontWeight: '900',
  },
  inputShell: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: overlay.line,
    borderRadius: 8,
    backgroundColor: palette.background,
    paddingHorizontal: 12,
    paddingTop: 7,
  },
  inputLabel: {
    color: overlay.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  input: {
    flex: 1,
    minHeight: 34,
    color: palette.text,
    paddingVertical: 0,
    fontSize: 15,
    fontWeight: '700',
  },
});
