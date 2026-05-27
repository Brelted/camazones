import React, { useState, useRef } from 'react';
import {
  View, TextInput, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from '../../theme';

/**
 * Input réutilisable Camazones
 *
 * @param {string}   label       - Label affiché au-dessus
 * @param {string}   placeholder
 * @param {string}   iconLeft    - Icône MaterialCommunityIcons à gauche
 * @param {string}   iconRight   - Icône à droite (ex: eye pour password)
 * @param {string}   error       - Message d'erreur (null = pas d'erreur)
 * @param {string}   helper      - Texte d'aide sous le champ
 * @param {boolean}  secure      - Cache le texte (password)
 */
export default function Input({
  label,
  error,
  helper,
  iconLeft,
  iconRight,
  secure       = false,
  onIconRightPress,
  style,
  containerStyle,
  ...props
}) {
  const [focused,    setFocused]    = useState(false);
  const [hideSecure, setHideSecure] = useState(secure);

  const borderAnim = useRef(new Animated.Value(0)).current;

  function onFocus() {
    setFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1, duration: 200, useNativeDriver: false,
    }).start();
    props.onFocus?.();
  }

  function onBlur() {
    setFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0, duration: 200, useNativeDriver: false,
    }).start();
    props.onBlur?.();
  }

  const borderColor = borderAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [error ? COLORS.error : COLORS.border, error ? COLORS.error : COLORS.primary],
  });

  const rightIcon = secure ? (hideSecure ? 'eye-outline' : 'eye-off-outline') : iconRight;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        {iconLeft && (
          <MaterialCommunityIcons
            name={iconLeft}
            size={20}
            color={focused ? COLORS.primary : COLORS.textLight}
            style={styles.iconLeft}
          />
        )}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={hideSecure}
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={secure ? () => setHideSecure((h) => !h) : onIconRightPress}
            style={styles.iconRight}
          >
            <MaterialCommunityIcons
              name={rightIcon}
              size={20}
              color={focused ? COLORS.primary : COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {error  && <Text style={styles.error}>{error}</Text>}
      {helper && !error && <Text style={styles.helper}>{helper}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:        { marginBottom: SPACING.md },
  label: {
    fontSize:   FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.text,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS.surface,
    borderRadius:    RADIUS.md,
    borderWidth:     1.5,
    paddingHorizontal: SPACING.md,
    ...SHADOW.sm,
  },
  input: {
    flex:       1,
    paddingVertical: 12,
    fontSize:   FONTS.sizes.md,
    color:      COLORS.text,
  },
  iconLeft:  { marginRight: SPACING.sm },
  iconRight: { marginLeft: SPACING.sm, padding: 2 },
  error: {
    marginTop: 4,
    fontSize:  FONTS.sizes.xs,
    color:     COLORS.error,
  },
  helper: {
    marginTop: 4,
    fontSize:  FONTS.sizes.xs,
    color:     COLORS.textLight,
  },
});
