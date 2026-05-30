import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Surface, Text, TextInput } from '../../components/ui';
import { Badge, ProductCard, SectionHeader } from '../../components/MarketplaceCards';
import { accountTypes, independentSellers, profilePhotos } from '../../data/marketplace';
import { useMarketplaceData } from '../../services/marketplaceService';
import { updateProfileRequest } from '../../services/profileService';
import { logout } from '../../store/slices/authSlice';
import {
  saveProfilePersisted,
  setDarkModePersisted,
  setLanguagePersisted,
  setProfilePhotoPersisted,
} from '../../store/slices/settingsSlice';
import { darkPalette, overlay, palette } from '../../theme';

export default function SellerScreen({ navigation, appSettings }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const settings = useSelector((state) => state.settings);
  const wallet = useSelector((state) => state.wallet);
  const { shops } = useMarketplaceData();
  const [activeType, setActiveType] = useState('professional');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const savedProfile = settings.savedProfile;
  const initialFirstName = savedProfile?.firstName ?? user?.firstName ?? 'Alan';
  const initialLastName = savedProfile?.lastName ?? user?.lastName ?? 'Camazones';
  const [profile, setProfile] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    email: user?.email ?? savedProfile?.email ?? 'client@camazones.demo',
    phone: savedProfile?.phone ?? user?.phone ?? '+237 6 90 00 00 00',
    city: savedProfile?.city ?? 'Douala',
    bio: savedProfile?.bio ?? 'Acheteur et vendeur actif sur Camazones.',
    address: savedProfile?.address ?? 'Camazones',
    profilePictureUrl: settings.profilePhotoUri ?? savedProfile?.profilePictureUrl ?? null,
  });

  const darkMode = Boolean(settings.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const surface = darkMode ? darkPalette.surface : overlay.surface;
  const isProfessional = activeType === 'professional';
  const avatarSource = profile.profilePictureUrl ? { uri: profile.profilePictureUrl } : profilePhotos[0];
  const t = appSettings?.t ?? ((key) => key);
  const money = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`;

  const screenStyle = useMemo(() => [styles.screen, { backgroundColor: colors.background }], [colors.background]);
  const changeField = (field, value) => setProfile((current) => ({ ...current, [field]: value }));

  const pickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission requise', 'Autorise la galerie pour ajouter une photo de profil.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.[0]?.uri) {
      return;
    }

    const image = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 640 } }],
      { compress: 0.72, format: ImageManipulator.SaveFormat.JPEG }
    );

    changeField('profilePictureUrl', image.uri);
    await dispatch(setProfilePhotoPersisted(image.uri));
  };

  const saveProfile = async () => {
    if (!profile.firstName.trim() || !profile.lastName.trim() || !profile.phone.trim()) {
      Alert.alert('Profil incomplet', 'Nom, prenom et telephone sont requis.');
      return;
    }

    setSaving(true);
    try {
      let remoteProfile = null;
      try {
        remoteProfile = await updateProfileRequest(profile);
      } catch (error) {
        remoteProfile = null;
      }
      const saved = { ...profile, ...(remoteProfile ?? {}) };
      await dispatch(saveProfilePersisted(saved));
      setProfile(saved);
      setEditMode(false);
      Alert.alert('Enregistre', 'Profil sauvegarde localement et synchronise si l API est disponible.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={screenStyle}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Surface style={[styles.profileCard, { backgroundColor: surface, borderColor: line }]}>
          <View style={styles.profileTop}>
            <Pressable onPress={pickProfilePhoto}>
              <Image source={avatarSource} style={styles.avatarPhoto} resizeMode="cover" />
            </Pressable>
            <View style={styles.profileCopy}>
              <Text style={[styles.eyebrow, { color: colors.secondary }]}>{t('profile')}</Text>
              <Text style={[styles.title, { color: colors.text }]}>{profile.firstName} {profile.lastName}</Text>
              <Text style={[styles.subtitle, { color: muted }]}>Profil editable, photo persistante, preferences sauvegardees.</Text>
            </View>
          </View>

          <View style={styles.profileActions}>
            <Button mode="outlined" compact onPress={pickProfilePhoto} textColor={colors.primary} style={[styles.actionButton, { borderColor: colors.green ?? palette.green }]}>
              {t('addPhoto')}
            </Button>
            <Button
              mode="contained"
              compact
              onPress={editMode ? saveProfile : () => setEditMode(true)}
              loading={saving}
              buttonColor={editMode ? colors.green ?? palette.green : colors.primary}
              textColor={colors.background}
              style={styles.actionButton}
            >
              {editMode ? t('save') : t('editInfo')}
            </Button>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <TextInput label="Prenom" value={profile.firstName} onChangeText={(value) => changeField('firstName', value)} editable={editMode} style={styles.flexInput} />
              <TextInput label="Nom" value={profile.lastName} onChangeText={(value) => changeField('lastName', value)} editable={editMode} style={styles.flexInput} />
            </View>
            <TextInput label="Email" value={profile.email} onChangeText={(value) => changeField('email', value)} editable={false} keyboardType="email-address" autoCapitalize="none" />
            <TextInput label="Telephone" value={profile.phone} onChangeText={(value) => changeField('phone', value)} editable={editMode} keyboardType="phone-pad" />
            <TextInput label="Ville" value={profile.city} onChangeText={(value) => changeField('city', value)} editable={editMode} />
            <TextInput label="Bio" value={profile.bio} onChangeText={(value) => changeField('bio', value)} editable={editMode} multiline />
          </View>

          <View style={styles.preferenceGrid}>
            <Pressable
              onPress={() => dispatch(setDarkModePersisted(!darkMode))}
              style={[styles.preferenceCard, { backgroundColor: darkMode ? palette.dark : overlay.green, borderColor: colors.green ?? palette.green }]}
            >
              <Text style={[styles.preferenceTitle, { color: darkMode ? palette.background : palette.text }]}>{t('darkMode')}</Text>
              <Text style={[styles.preferenceText, { color: darkMode ? darkPalette.muted : overlay.muted }]}>{darkMode ? 'ON' : 'OFF'}</Text>
            </Pressable>

            <View style={[styles.preferenceCard, { backgroundColor: surface, borderColor: line }]}>
              <Text style={[styles.preferenceTitle, { color: colors.text }]}>{t('language')}</Text>
              <View style={styles.langRow}>
                {['fr', 'en'].map((lang) => (
                  <Pressable
                    key={lang}
                    onPress={() => dispatch(setLanguagePersisted(lang))}
                    style={[styles.langButton, settings.language === lang && { backgroundColor: colors.primary }]}
                  >
                    <Text style={[styles.langText, { color: settings.language === lang ? colors.background : colors.primary }]}>
                      {lang.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <Pressable onPress={() => navigation.navigate('Wallet')} style={[styles.walletCard, { borderColor: line, backgroundColor: darkMode ? palette.dark : overlay.orange }]}>
            <View>
              <Text style={[styles.walletTitle, { color: colors.text }]}>{t('wallet')}</Text>
              <Text style={[styles.walletText, { color: muted }]}>Solde: {money(wallet.balance)}</Text>
            </View>
            <Text style={[styles.walletAction, { color: colors.primary }]}>{t('pay')} ›</Text>
          </Pressable>

          <Button mode="contained" onPress={() => dispatch(logout())} buttonColor={palette.orange} textColor={palette.background}>
            {t('logout')}
          </Button>
        </Surface>

        <SectionHeader title="Historique des modifications" description="Les sauvegardes profil sont tracees localement." />
        <View style={styles.stack}>
          {settings.changeHistory.length ? (
            settings.changeHistory.map((item) => (
              <Surface key={item.id} style={[styles.historyCard, { backgroundColor: surface, borderColor: line }]}>
                <Text style={[styles.historyTitle, { color: colors.text }]}>{item.label}</Text>
                <Text style={[styles.historyDate, { color: muted }]}>{new Date(item.at).toLocaleString('fr-FR')}</Text>
              </Surface>
            ))
          ) : (
            <Text style={[styles.subtitle, { color: muted }]}>Aucune modification sauvegardee pour le moment.</Text>
          )}
        </View>

        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>Profils separes</Text>
          <Text style={[styles.sectionLead, { color: colors.text }]}>Client actif ou boutique, la logique change.</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Camazones distingue vendeurs sans vitrine et boutiques professionnelles avec catalogue.</Text>
        </View>

        <View style={styles.typeGrid}>
          {accountTypes.map((item) => {
            const active = activeType === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setActiveType(item.id)}
                style={[styles.typeCard, { borderColor: active ? colors.primary : line, backgroundColor: active ? colors.primary : surface }]}
              >
                <View style={styles.typeTop}>
                  <Text style={[styles.typeIcon, { color: active ? colors.background : colors.primary }]}>{item.id === 'professional' ? '◇' : '●'}</Text>
                  <Text style={[styles.typeTitle, { color: active ? colors.background : colors.text }]}>{item.label}</Text>
                </View>
                <Text style={[styles.typeText, { color: active ? colors.background : muted }]}>{item.description}</Text>
              </Pressable>
            );
          })}
        </View>

        {isProfessional ? (
          <>
            <SectionHeader title="Boutiques professionnelles" description="Apercu des vitrines; la zone complete est dans l onglet Boutiques." />
            <View style={styles.stack}>
              {shops.slice(0, 3).map((shop) => (
                <Surface key={shop.id} style={[styles.shopLine, { backgroundColor: surface, borderColor: line }]}>
                  <View style={styles.typeTop}>
                    <Text style={[styles.profileName, { color: colors.text }]}>{shop.name}</Text>
                    {shop.premium ? <Text style={styles.star}>★</Text> : null}
                  </View>
                  <Text style={[styles.profileMeta, { color: muted }]}>{shop.city} · {shop.products.length} articles</Text>
                  <View style={styles.badgeRow}>
                    <Badge type="professional" />
                    {shop.certifiedByAp ? <Badge type="ap" /> : null}
                    {shop.premium ? <Badge type="premium" /> : null}
                  </View>
                </Surface>
              ))}
            </View>
          </>
        ) : (
          <>
            <SectionHeader title="Clients independants vendeurs" description="Ils vendent souvent, mais sans vitrine boutique complete." />
            <View style={styles.stack}>
              {independentSellers.map((seller) => (
                <Surface key={seller.id} style={[styles.sellerCard, { backgroundColor: surface, borderColor: line }]}>
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
    paddingBottom: 92,
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
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  flexInput: {
    flex: 1,
  },
  preferenceGrid: {
    gap: 10,
  },
  preferenceCard: {
    minHeight: 74,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'center',
    gap: 8,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  preferenceText: {
    lineHeight: 19,
    fontWeight: '800',
  },
  langRow: {
    flexDirection: 'row',
    gap: 8,
  },
  langButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: overlay.soft,
  },
  langText: {
    fontSize: 12,
    fontWeight: '900',
  },
  walletCard: {
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  walletText: {
    marginTop: 3,
    fontWeight: '800',
  },
  walletAction: {
    fontSize: 14,
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
  shopLine: {
    gap: 10,
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
  star: {
    color: palette.orange,
    fontSize: 14,
    fontWeight: '900',
  },
  historyCard: {
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
  },
  historyTitle: {
    fontWeight: '900',
  },
  historyDate: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '700',
  },
});
