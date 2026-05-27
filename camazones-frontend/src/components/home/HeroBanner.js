import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 190;

// ── Slides du banner ──────────────────────────────────────────────────────────
const SLIDES = [
  {
    id:       '1',
    bg:       [COLORS.primary, '#D4460E'],   // orange
    icon:     'lightning-bolt',
    iconBg:   'rgba(255,255,255,0.2)',
    promo:    '⚡ FLASH DEAL',
    title:    'Électronique\nà prix réduit',
    sub:      'Jusqu\'à -30% sur les smartphones',
    btn:      'Voir les offres',
    pattern:  '#FF8C5A',
  },
  {
    id:       '2',
    bg:       [COLORS.forest, '#1A4A34'],    // vert forêt
    icon:     'hanger',
    iconBg:   'rgba(255,255,255,0.15)',
    promo:    '👗 NOUVELLE COLLECTION',
    title:    'Mode Africaine\nAuthentique',
    sub:      'Tissus kente, boubous, pagne',
    btn:      'Découvrir',
    pattern:  '#3D8B6E',
  },
  {
    id:       '3',
    bg:       [COLORS.earth, '#8B5E15'],     // terre brûlée
    icon:     'palette',
    iconBg:   'rgba(255,255,255,0.2)',
    promo:    '🎨 FAIT MAIN',
    title:    'Artisanat Local\nde Qualité',
    sub:      'Sculptures, bijoux, poteries',
    btn:      'Explorer',
    pattern:  '#D4900A',
  },
];

// ── Composant ─────────────────────────────────────────────────────────────────

export default function HeroBanner({ onSlidePress }) {
  const flatListRef  = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const dotsAnim    = useRef(SLIDES.map(() => new Animated.Value(0))).current;

  // Auto-scroll toutes les 3.5s
  useEffect(() => {
    animateDot(0);
    const interval = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % SLIDES.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        animateDot(next);
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  function animateDot(idx) {
    dotsAnim.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue:         i === idx ? 1 : 0,
        duration:        250,
        useNativeDriver: false,
      }).start();
    });
  }

  function onScrollEnd(event) {
    const idx = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (idx !== activeIdx) {
      setActiveIdx(idx);
      animateDot(idx);
    }
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <SlideItem slide={item} onPress={() => onSlidePress?.(item)} />
        )}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index,
        })}
      />

      {/* Indicateur dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => {
          const width = dotsAnim[i].interpolate({
            inputRange:  [0, 1],
            outputRange: [6, 22],
          });
          const bg = dotsAnim[i].interpolate({
            inputRange:  [0, 1],
            outputRange: ['rgba(255,255,255,0.4)', '#fff'],
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width, backgroundColor: bg }]}
            />
          );
        })}
      </View>
    </View>
  );
}

// ── Slide individuel ──────────────────────────────────────────────────────────

function SlideItem({ slide, onPress }) {
  const scale = useRef(new Animated.Value(0.92)).current;
  const fade  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
      Animated.timing(fade,  { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <TouchableOpacity
      style={[styles.slide, { backgroundColor: slide.bg[0] }]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Cercle décoratif flou en fond */}
      <View style={[styles.bgCircle, { backgroundColor: slide.pattern }]} />
      <View style={[styles.bgCircle2, { backgroundColor: slide.bg[1] }]} />

      <Animated.View style={[styles.slideContent, { opacity: fade, transform: [{ scale }] }]}>
        {/* Icône */}
        <View style={[styles.iconContainer, { backgroundColor: slide.iconBg }]}>
          <MaterialCommunityIcons name={slide.icon} size={28} color="#fff" />
        </View>

        {/* Texte */}
        <View style={styles.textArea}>
          <Text style={styles.promo}>{slide.promo}</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.sub}>{slide.sub}</Text>
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.cta} onPress={onPress}>
          <Text style={styles.ctaText}>{slide.btn}</Text>
          <MaterialCommunityIcons name="arrow-right" size={14} color={slide.bg[0]} />
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: { height: BANNER_HEIGHT + 24, marginHorizontal: SPACING.md, marginTop: SPACING.sm },

  // Slide
  slide: {
    width: SCREEN_WIDTH - SPACING.md * 2,
    height: BANNER_HEIGHT,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    padding: SPACING.md,
    justifyContent: 'center',
  },
  bgCircle: {
    position: 'absolute', right: -40, top: -40,
    width: 160, height: 160, borderRadius: 80, opacity: 0.25,
  },
  bgCircle2: {
    position: 'absolute', right: 60, bottom: -60,
    width: 120, height: 120, borderRadius: 60, opacity: 0.3,
  },
  slideContent: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  iconContainer: {
    width: 56, height: 56, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  textArea:  { flex: 1 },
  promo:     { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.9)', fontWeight: FONTS.weights.bold, marginBottom: 2 },
  title:     { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.black, color: '#fff', lineHeight: 22, marginBottom: 4 },
  sub:       { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.8)' },
  cta: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#fff', borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', marginTop: 8,
  },
  ctaText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.text },

  // Dots
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 10 },
  dot:     { height: 6, borderRadius: 3 },
});
