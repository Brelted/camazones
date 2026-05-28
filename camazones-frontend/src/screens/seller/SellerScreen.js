import React, { useMemo, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Surface, Text, TextInput } from '../../components/ui';
import { Badge, ProductCard, SectionHeader, ShopCard } from '../../components/MarketplaceCards';
import { accountTypes, independentSellers, profilePhotos, shops } from '../../data/marketplace';
import { logout } from '../../store/slices/authSlice';
import { darkPalette, overlay, palette } from '../../theme';

export default function SellerScreen({ navigation, appSettings }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [activeType, setActiveType] = useState('professional');
  const [editMode, setEditMode] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [profile, setProfile] = useState({
    name: `${user?.firstName ?? 'Alan'} ${user?.lastName ?? 'Camazones'}`.trim(),
    email: user?.email ?? 'client@camazones.demo',
    phone: user?.phone ?? '+237 6 90 00 00 00',
    city: 'Douala',
  });

  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const surface = darkMode ? darkPalette.surface : overlay.surface;
  const isProfessional = activeType === 'professional';
  const avatar = profilePhotos[avatarIndex % profilePhotos.length];

  const screenStyle = useMemo(
    () => [styles.screen, { backgroundColor: colors.background }],
    [colors.background]
  );

  const changeField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  return (
    <SafeAreaView style={screenStyle}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Surface style={[styles.profileCard, { backgroundColor: surface, borderColor: line }]} elevation={0}>
          <View style={styles.profileTop}>
            <Image source={avatar} style={styles.avatarPhoto} resizeMode="cover" />
            <View style={styles.profileCopy}>
              <Text style={[styles.eyebrow, { color: colors.secondary }]}>Profil</Text>
              <Text style={[styles.title, { color: colors.text }]}>{profile.name}</Text>
              <Text style={[styles.subtitle, { color: muted }]}>Compte connecte, editable et pret pour la vente.</Text>
            </View>
          </View>

          <View style={styles.profileActions}>
            <Button
              mode="outlined"
              compact
              onPress={() => setAvatarIndex((current) => current + 1)}
              textColor={colors.primary}
              style={[styles.actionButton, { borderColor: colors.green ?? palette.green }]}
            >
              Ajouter photo
            </Button>
            <Button
              mode="contained"
              compact
              onPress={() => setEditMode((current) => !current)}
              buttonColor={editMode ? colors.green ?? palette.green : colors.primary}
              textColor={colors.background}
              style={styles.actionButton}
            >
              {editMode ? 'Enregistrer' : 'Modifier infos'}
            </Button>
          </View>

          <View style={styles.form}>
            <TextInput label="Nom complet" value={profile.name} onChangeText={(value) => changeField('name', value)} editable={editMode} />
            <TextInput label="Email" value={profile.email} onChangeText={(value) => changeField('email', value)} editable={editMode} keyboardType="email-address" autoCapitalize="none" />
            <TextInput label="Telephone" value={profile.phone} onChangeText={(value) => changeField('phone', value)} editable={editMode} keyboardType="phone-pad" />
            <TextInput label="Ville" value={profile.city} onChangeText={(value) => changeField('city', value)} editable={editMode} />
          </View>

          <Pressable
            onPress={() => appSettings?.setDarkMode?.(!darkMode)}
            style={[styles.darkToggle, { backgroundColor: darkMode ? palette.dark : overlay.green, borderColor: colors.green ?? palette.green }]}
          >
            <View>
              <Text style={[styles.darkTitle, { color: darkMode ? palette.background : palette.text }]}>Mode sombre</Text>
              <Text style={[styles.darkText, { color: darkMode ? darkPalette.muted : overlay.muted }]}>
                {darkMode ? 'Active sur la navigation et le profil.' : 'Desactive, interface claire et douce.'}
              </Text>
            </View>
            <Text style={[styles.darkState, { color: darkMode ? palette.background : palette.green }]}>
              {darkMode ? 'ON' : 'OFF'}
            </Text>
          </Pressable>

          <Button mode="contained" onPress={() => dispatch(logout())} buttonColor={palette.orange} textColor={palette.background}>
            Se deconnecter
          </Button>
        </Surface>

        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>Profils separes</Text>
          <Text style={[styles.sectionLead, { color: colors.text }]}>Client actif ou boutique, la logique change.</Text>
          <Text style={[styles.subtitle, { color: muted }]}>
            Camazones distingue les vendeurs sans vitrine des boutiques professionnelles avec catalogue visible.
          </Text>
        </View>

        <View style={styles.typeGrid}>
          {accountTypes.map((item) => {
            const active = activeType === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => setActiveType(item.id)}
                style={[
                  styles.typeCard,
                  { borderColor: active ? colors.primary : line, backgroundColor: active ? colors.primary : surface },
                ]}
              >
                <View style={styles.typeTop}>
                  <Text style={[styles.typeIcon, { color: active ? colors.background : colors.primary }]}>
                    {item.id === 'professional' ? '◆' : '●'}
                  </Text>
                  <Text style={[styles.typeTitle, { color: active ? colors.background : colors.text }]}>{item.label}</Text>
                </View>
                <Text style={[styles.typeText, { color: active ? colors.background : muted }]}>{item.description}</Text>
              </Pressable>
            );
          })}
        </View>

        {isProfessional ? (
          <>
            <SectionHeader title="Boutiques professionnelles" description="La zone boutique affiche uniquement des boutiques avec vitrine." />
            <View style={styles.stack}>
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} onPress={() => navigation.navigate('Home')} />
              ))}
            </View>
          </>
        ) : (
          <>
            <SectionHeader title="Clients independants vendeurs" description="Ils vendent souvent, mais sans vitrine boutique complete." />
            <View style={styles.stack}>
              {independentSellers.map((seller) => (
                <Surface key={seller.id} style={[styles.sellerCard, { backgroundColor: surface, borderColor: line }]} elevation={0}>
                  <View style={styles.profileTop}>
                    <Image source={seller.avatar} style={styles.sellerPhoto} resizeMode="cover" />
                    <View style={styles.profileCopy}>
                      <Text style={[styles.profileName, { color: colors.text }]}>{seller.name}</Text>
                      <Text style={[styles.profileMeta, { color: muted }]}>{seller.city} · sans vitrine</Text>
                    </View>
                  </View>
                  <Text style={[styles.profileText, { color: muted }]}>{seller.tagline}</Text>
                  <View style={styles.badgeRow}>
                    <Badge type="independent" />
                    {seller.certifiedByAp ? <Badge type="ap" /> : null}
                    {seller.premium ? <Badge type="premium" /> : null}
                  </View>
                  {seller.products.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={{ product: item, seller, sellerType: 'independent' }}
                      onMessage={() => navigation.navigate('Messages', { sellerName: seller.name })}
                      onBuy={() => navigation.navigate('Wallet', { productTitle: item.title })}
                    />
                  ))}
                </Surface>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 108,
    gap: 18,
  },
  profileCard: {
    gap: 14,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPhoto: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: overlay.soft,
  },
  sellerPhoto: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: overlay.soft,
  },
  profileCopy: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  form: {
    gap: 10,
  },
  darkToggle: {
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
  },
  darkTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  darkText: {
    marginTop: 3,
    lineHeight: 19,
  },
  darkState: {
    fontSize: 13,
    fontWeight: '900',
  },
  header: {
    gap: 9,
  },
  sectionLead: {
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  typeGrid: {
    gap: 10,
  },
  typeCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 9,
  },
  typeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  typeIcon: {
    fontSize: 14,
    fontWeight: '900',
  },
  typeText: {
    lineHeight: 20,
  },
  stack: {
    gap: 12,
  },
  sellerCard: {
    gap: 12,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '900',
  },
  profileMeta: {
    fontSize: 12,
    fontWeight: '700',
  },
  profileText: {
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
