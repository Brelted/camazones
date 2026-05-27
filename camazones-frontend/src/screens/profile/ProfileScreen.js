import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { logout } from '../../store/slices/authSlice';
import KenteStripe from '../../components/home/KenteStripe';
import Badge       from '../../components/ui/Badge';
import Button      from '../../components/ui/Button';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

// ── Config des lignes du menu profil ─────────────────────────────────────────
const MENU_SECTIONS = [
  {
    title: 'Mon compte',
    items: [
      { icon: 'account-edit-outline',   label: 'Modifier le profil',      screen: null },
      { icon: 'lock-reset',             label: 'Changer de mot de passe', screen: null },
      { icon: 'map-marker-outline',     label: 'Mes adresses',            screen: null },
    ],
  },
  {
    title: 'Mes activités',
    items: [
      { icon: 'shopping-outline',       label: 'Mes commandes',           screen: null },
      { icon: 'heart-outline',          label: 'Mes favoris',             screen: null },
      { icon: 'store-outline',          label: 'Ma boutique',             screen: 'Seller' },
      { icon: 'wallet-outline',         label: 'Mon portefeuille',        screen: 'Wallet' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle-outline',    label: 'Aide & FAQ',              screen: null },
      { icon: 'shield-check-outline',   label: 'Confidentialité',         screen: null },
      { icon: 'information-outline',    label: 'À propos de Camazones',   screen: null },
    ],
  },
];

const ROLE_LABELS = {
  BUYER:  { label: 'Acheteur',     variant: 'forest'    },
  SELLER: { label: 'Vendeur',      variant: 'secondary' },
  ADMIN:  { label: 'Administrateur', variant: 'dark'    },
};

// ─────────────────────────────────────────────────────────────────────────────

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  // ── Animations ─────────────────────────────────────────────────────────────
  const avatarScale = useRef(new Animated.Value(0)).current;
  const contentO    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(avatarScale, {
        toValue: 1, tension: 60, friction: 6, useNativeDriver: true,
      }),
      Animated.timing(contentO, {
        toValue: 1, duration: 500, delay: 150, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────

  function onMenuPress(item) {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else {
      Alert.alert('Bientôt disponible', 'Cette fonctionnalité arrive prochainement !');
    }
  }

  function onLogout() {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: () => dispatch(logout()) },
      ],
    );
  }

  const roleInfo = ROLE_LABELS[user?.role] || ROLE_LABELS.BUYER;
  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join('') || '?';

  // ── Rendu ──────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>

      {/* ── Header Avatar ── */}
      <View style={styles.header}>
        <KenteStripe height={3} />
        <View style={styles.headerContent}>

          {/* Avatar animé */}
          <Animated.View style={[styles.avatarWrapper, { transform: [{ scale: avatarScale }] }]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            {/* Badge rôle sur l'avatar */}
            <View style={styles.roleBadgeWrapper}>
              <Badge variant={roleInfo.variant} size="sm">{roleInfo.label}</Badge>
            </View>
          </Animated.View>

          {/* Infos utilisateur */}
          <Animated.View style={[styles.userInfo, { opacity: contentO }]}>
            <Text style={styles.userName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {user?.city && (
              <View style={styles.cityRow}>
                <MaterialCommunityIcons name="map-marker" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.userCity}>{user.city}</Text>
              </View>
            )}
          </Animated.View>

          {/* Stats rapides */}
          <Animated.View style={[styles.statsRow, { opacity: contentO }]}>
            <StatItem value="0"  label="Commandes" />
            <View style={styles.statDivider} />
            <StatItem value="0"  label="Produits"  />
            <View style={styles.statDivider} />
            <StatItem value="0 XAF" label="Wallet" />
          </Animated.View>
        </View>
      </View>

      {/* ── Menu ── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.menuItem,
                    idx < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={() => onMenuPress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconBg}>
                    <MaterialCommunityIcons name={item.icon} size={20} color={COLORS.primary} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.textLight} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Bouton déconnexion */}
        <View style={styles.logoutSection}>
          <Button
            variant="danger"
            icon="logout"
            fullWidth
            onPress={onLogout}
          >
            Se déconnecter
          </Button>
          <Text style={styles.version}>Camazones v1.0.0 — Le marché africain 🌍</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

// ── Sous-composants ───────────────────────────────────────────────────────────

function StatItem({ value, label }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: { backgroundColor: COLORS.primary, paddingBottom: SPACING.lg },
  headerContent: { alignItems: 'center', paddingHorizontal: SPACING.md, paddingTop: SPACING.md },

  // Avatar
  avatarWrapper: { position: 'relative', marginBottom: SPACING.sm },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.4)',
    ...SHADOW.lg,
  },
  avatarText:       { fontSize: 34, fontWeight: FONTS.weights.black, color: COLORS.night },
  roleBadgeWrapper: { position: 'absolute', bottom: -4, right: -8 },

  // Infos user
  userInfo:  { alignItems: 'center', marginBottom: SPACING.md },
  userName:  { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.black, color: '#fff', marginBottom: 2 },
  userEmail: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)' },
  cityRow:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  userCity:  { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)' },

  // Stats
  statsRow: {
    flexDirection:   'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius:    RADIUS.lg,
    paddingVertical: SPACING.sm + 2,
    width: '100%',
  },
  statItem:    { flex: 1, alignItems: 'center' },
  statValue:   { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.black, color: '#fff' },
  statLabel:   { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)' },

  // Menu
  scrollContent: { padding: SPACING.md },
  section:       { marginBottom: SPACING.md },
  sectionTitle:  { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.textLight, marginBottom: SPACING.sm, paddingLeft: 4 },
  menuCard:      { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },
  menuItem: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  menuIconBg: {
    width: 38, height: 38, borderRadius: RADIUS.md,
    backgroundColor: `${COLORS.primary}12`,
    justifyContent: 'center', alignItems: 'center',
  },
  menuLabel: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.text, fontWeight: FONTS.weights.medium },

  // Logout
  logoutSection: { marginTop: SPACING.sm, gap: SPACING.sm },
  version:       { textAlign: 'center', fontSize: FONTS.sizes.xs, color: COLORS.textLight },
});
