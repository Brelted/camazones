import React, { useRef, useState } from 'react';
import {
  View, TextInput, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from '../../theme';

/**
 * Barre de recherche globale
 * Peut être utilisée sur HomeScreen, en navigation vers SearchScreen,
 * ou en mode inline avec onChange.
 *
 * @param {function} onSearch     - Appelé quand l'utilisateur soumet (texte)
 * @param {function} onChange     - Appelé à chaque frappe (mode inline)
 * @param {function} onFocusTap   - Appelé quand on tape sur la barre (mode navigable)
 * @param {string}   placeholder
 * @param {boolean}  editable     - false = barre est un bouton de navigation
 * @param {string}   value        - Valeur contrôlée
 */
export default function GlobalSearchBar({
  onSearch,
  onChange,
  onFocusTap,
  placeholder = 'Rechercher un produit, une boutique...',
  editable    = true,
  value,
  style,
}) {
  const [text,    setText]    = useState(value ?? '');
  const [focused, setFocused] = useState(false);

  const shadowAnim = useRef(new Animated.Value(0)).current;

  function handleFocus() {
    setFocused(true);
    Animated.timing(shadowAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  }
  function handleBlur() {
    setFocused(false);
    Animated.timing(shadowAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  }
  function handleChange(t) {
    setText(t);
    onChange?.(t);
  }
  function handleClear() {
    setText('');
    onChange?.('');
  }
  function handleSubmit() {
    if (text.trim()) onSearch?.(text.trim());
  }

  const elevation = shadowAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [2, 6],
  });
  const borderColor = focused ? COLORS.primary : COLORS.border;

  return (
    <Animated.View style={[styles.container, { elevation, borderColor }, style]}>
      {/* Icône loupe */}
      <MaterialCommunityIcons
        name="magnify"
        size={22}
        color={focused ? COLORS.primary : COLORS.textLight}
        style={styles.iconLeft}
      />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        value={text}
        onChangeText={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        editable={editable}
        onPressIn={onFocusTap}
      />

      {/* Croix de réinitialisation */}
      {text.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
          <MaterialCommunityIcons name="close-circle" size={18} color={COLORS.textLight} />
        </TouchableOpacity>
      )}

      {/* Bouton filtre (facultatif) */}
      <TouchableOpacity style={styles.filterBtn}>
        <MaterialCommunityIcons name="tune-variant" size={18} color={COLORS.primary} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS.surface,
    borderRadius:    RADIUS.xl,
    borderWidth:     1.5,
    paddingHorizontal: SPACING.md,
    paddingVertical:   10,
    marginHorizontal:  SPACING.md,
    marginVertical:    SPACING.sm,
    ...SHADOW.sm,
  },
  iconLeft: { marginRight: SPACING.sm },
  input: {
    flex:        1,
    fontSize:    FONTS.sizes.md,
    color:       COLORS.text,
    paddingVertical: 0,
  },
  clearBtn:  { padding: 2, marginLeft: SPACING.xs },
  filterBtn: {
    marginLeft:       SPACING.sm,
    backgroundColor:  `${COLORS.primary}15`,
    padding:          6,
    borderRadius:     RADIUS.sm,
  },
});
