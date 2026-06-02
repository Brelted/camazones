import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Surface, Text, TextInput } from '../../components/ui';
import { Badge, ProductCard, SectionHeader } from '../../components/MarketplaceCards';
import { accountTypes, categories, independentSellers } from '../../data/marketplace';
import { getShopIdForEmail, savePublishedProduct, useMarketplaceData } from '../../services/marketplaceService';
import { exportInvoicePdf } from '../../services/pdfService';
import { updateProfileRequest } from '../../services/profileService';
import { logout } from '../../store/slices/authSlice';
import {
  saveProfilePersisted,
  setDarkModePersisted,
  setLanguagePersisted,
  setProfilePhotoPersisted,
} from '../../store/slices/settingsSlice';
import { saveInvoice } from '../../store/slices/walletSlice';
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
  const [publishing, setPublishing] = useState(false);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Accessoires',
    price: '',
    stock: 'En stock',
    description: '',
    imageUri: null,
  });
  const userEmail = user?.email ?? 'client@camazones.demo';
  const savedProfile = settings.profilesByEmail?.[userEmail];
  const savedPhoto = settings.photosByEmail?.[userEmail];
  const [profile, setProfile] = useState({
    firstName: savedProfile?.firstName ?? user?.firstName ?? 'Alan',
    lastName: savedProfile?.lastName ?? user?.lastName ?? 'Camazones',
    email: userEmail,
    phone: savedProfile?.phone ?? user?.phone ?? '+237 6 90 00 00 00',
    city: savedProfile?.city ?? 'Douala',
    bio: savedProfile?.bio ?? 'Acheteur et vendeur actif sur Camazones.',
    address: savedProfile?.address ?? 'Camazones',
    profilePictureUrl: savedPhoto ?? savedProfile?.profilePictureUrl ?? null,
  });

  const darkMode = Boolean(settings.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const surface = darkMode ? darkPalette.surface : overlay.surface;
  const isProfessional = activeType === 'professional';
  const profileInitials = `${profile.firstName?.[0] ?? 'C'}${profile.lastName?.[0] ?? 'M'}`.toUpperCase();
  const ownedShopId = getShopIdForEmail(userEmail);
  const ownedShop = useMemo(() => shops.find((shop) => shop.id === ownedShopId), [ownedShopId, shops]);
  const professionalShops = useMemo(() => {
    if (!ownedShop) {
      return shops.slice(0, 3);
    }
    return [ownedShop, ...shops.filter((shop) => shop.id !== ownedShop.id).slice(0, 2)];
  }, [ownedShop, shops]);
  const t = appSettings?.t ?? ((key) => key);
  const money = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`;
  const changeHistory = settings.historyByEmail?.[userEmail] ?? [];
  const publishCategories = categories.filter((category) => category.match);
  const purchaseHistory = wallet.transactions.filter(
    (transaction) => transaction.type === 'payment' && transaction.email === userEmail
  );

  const screenStyle = useMemo(() => [styles.screen, { backgroundColor: colors.background }], [colors.background]);
  const changeField = (field, value) => setProfile((current) => ({ ...current, [field]: value }));
  const downloadReceipt = async (transaction) => {
    const invoice = transaction.invoice ?? {
      id: transaction.id,
      productTitle: transaction.label,
      total: money(Math.abs(transaction.amount)),
      method: transaction.method ?? 'Camazones Pay',
      customerName: `${profile.firstName} ${profile.lastName}`.trim(),
      email: userEmail,
    };
    const uri = await exportInvoicePdf({
      productTitle: invoice.productTitle,
      total: invoice.total,
      method: invoice.method,
      transactionId: invoice.id,
      customerName: invoice.customerName ?? `${profile.firstName} ${profile.lastName}`.trim(),
      email: invoice.email ?? userEmail,
    });
    await dispatch(saveInvoice({ ...invoice, uri }));
  };

  useEffect(() => {
    const nextSavedProfile = settings.profilesByEmail?.[userEmail];
    const nextSavedPhoto = settings.photosByEmail?.[userEmail];
    setProfile({
      firstName: nextSavedProfile?.firstName ?? user?.firstName ?? 'Alan',
      lastName: nextSavedProfile?.lastName ?? user?.lastName ?? 'Camazones',
      email: userEmail,
      phone: nextSavedProfile?.phone ?? user?.phone ?? '+237 6 90 00 00 00',
      city: nextSavedProfile?.city ?? 'Douala',
      bio: nextSavedProfile?.bio ?? 'Acheteur et vendeur actif sur Camazones.',
      address: nextSavedProfile?.address ?? 'Camazones',
      profilePictureUrl: nextSavedPhoto ?? nextSavedProfile?.profilePictureUrl ?? null,
    });
    setEditMode(false);
  }, [settings.profilesByEmail, settings.photosByEmail, user?.firstName, user?.lastName, user?.phone, userEmail]);

  const pickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('permissionRequired'), t('photoPermissionText'));
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
    await dispatch(setProfilePhotoPersisted({ email: userEmail, uri: image.uri }));
  };

  const saveProfile = async () => {
    if (!profile.firstName.trim() || !profile.lastName.trim() || !profile.phone.trim()) {
      Alert.alert(t('incompleteProfile'), t('incompleteProfileText'));
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
      await dispatch(saveProfilePersisted({ email: userEmail, profile: saved }));
      setProfile(saved);
      setEditMode(false);
      Alert.alert(t('profileSaved'), t('profileSavedText'));
    } finally {
      setSaving(false);
    }
  };

  const changeProductField = (field, value) => setProductForm((current) => ({ ...current, [field]: value }));

  const pickProductImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('permissionRequired'), t('photoPermissionText'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.[0]?.uri) {
      return;
    }

    const image = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 900 } }],
      { compress: 0.76, format: ImageManipulator.SaveFormat.JPEG }
    );

    changeProductField('imageUri', image.uri);
  };

  const publishProduct = async () => {
    const price = Number(productForm.price.replace(/[^0-9]/g, ''));
    if (!productForm.title.trim() || !productForm.description.trim() || !price) {
      Alert.alert('Article incomplet', 'Ajoute un nom, une description et un prix valide.');
      return;
    }

    setPublishing(true);
    try {
      await savePublishedProduct({
        user,
        payload: {
          ...productForm,
          price,
          city: profile.city,
        },
      });
      setProductForm({ title: '', category: 'Accessoires', price: '', stock: 'En stock', description: '', imageUri: null });
      if (ownedShop) {
        setActiveType('professional');
      }
      Alert.alert('Article publie', ownedShop ? 'Il apparaitra dans ta vitrine et la recherche.' : 'Il apparaitra dans la recherche comme vendeur independant.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <SafeAreaView style={screenStyle}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Surface style={[styles.profileCard, { backgroundColor: surface, borderColor: line }]}>
          <View style={styles.profileTop}>
            <Pressable onPress={pickProfilePhoto}>
              <View style={[styles.avatarPhoto, { backgroundColor: darkMode ? palette.darkSurface : overlay.green, borderColor: line }]}>
                {profile.profilePictureUrl ? (
                  <Image source={{ uri: profile.profilePictureUrl }} style={styles.avatarImage} resizeMode="cover" />
                ) : (
                  <Text style={[styles.avatarInitials, { color: colors.primary }]}>{profileInitials}</Text>
                )}
              </View>
            </Pressable>
            <View style={styles.profileCopy}>
              <Text style={[styles.eyebrow, { color: colors.secondary }]}>{t('profile')}</Text>
              <Text style={[styles.title, { color: colors.text }]}>{profile.firstName} {profile.lastName}</Text>
              <Text style={[styles.subtitle, { color: muted }]}>{t('profileSavedText')}</Text>
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
              <TextInput label={t('firstName')} value={profile.firstName} onChangeText={(value) => changeField('firstName', value)} editable={editMode} style={styles.flexInput} />
              <TextInput label={t('lastName')} value={profile.lastName} onChangeText={(value) => changeField('lastName', value)} editable={editMode} style={styles.flexInput} />
            </View>
            <TextInput label={t('email')} value={profile.email} onChangeText={(value) => changeField('email', value)} editable={false} keyboardType="email-address" autoCapitalize="none" />
            <TextInput label={t('phone')} value={profile.phone} onChangeText={(value) => changeField('phone', value)} editable={editMode} keyboardType="phone-pad" />
            <TextInput label={t('city')} value={profile.city} onChangeText={(value) => changeField('city', value)} editable={editMode} />
            <TextInput label={t('bio')} value={profile.bio} onChangeText={(value) => changeField('bio', value)} editable={editMode} multiline />
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
              <Text style={[styles.walletText, { color: muted }]}>{t('balance')}: {money(wallet.balance)}</Text>
            </View>
            <Text style={[styles.walletAction, { color: colors.primary }]}>{t('pay')} ›</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Games')} style={[styles.gamesCard, { borderColor: line, backgroundColor: darkMode ? palette.darkSurface : overlay.green }]}>
            <View>
              <Text style={[styles.walletTitle, { color: colors.text }]}>🎮 Mini-jeux</Text>
              <Text style={[styles.walletText, { color: muted }]}>🐍 Snake · 🍉 Fruit Slash · 🧠 Memory · 🥷 Ninja</Text>
            </View>
            <Text style={[styles.walletAction, { color: colors.primary }]}>›</Text>
          </Pressable>

          <Button mode="contained" onPress={() => dispatch(logout())} buttonColor={palette.orange} textColor={palette.background}>
            {t('logout')}
          </Button>
        </Surface>

        <SectionHeader
          title={ownedShop ? `Publier dans ${ownedShop.name}` : 'Publier un article'}
          description={ownedShop ? 'Tes articles apparaissent dans ta vitrine et dans la recherche.' : 'Ton article apparait comme annonce independante dans la recherche.'}
        />
        <Surface style={[styles.publishCard, { backgroundColor: surface, borderColor: line }]}>
          <TextInput label="Nom article" value={productForm.title} onChangeText={(value) => changeProductField('title', value)} />
          <View style={styles.categoryPicker}>
            {publishCategories.map((category) => {
              const active = productForm.category === category.match;
              return (
                <Pressable
                  key={category.id}
                  onPress={() => changeProductField('category', category.match)}
                  style={[styles.categoryChip, { borderColor: active ? colors.primary : line, backgroundColor: active ? colors.primary : darkMode ? palette.dark : overlay.soft }]}
                >
                  <Text style={[styles.categoryChipText, { color: active ? colors.background : colors.text }]}>{category.icon} {category.match}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.row}>
            <TextInput label="Prix FCFA" value={productForm.price} onChangeText={(value) => changeProductField('price', value.replace(/[^0-9]/g, ''))} keyboardType="number-pad" style={styles.flexInput} />
            <TextInput label="Stock" value={productForm.stock} onChangeText={(value) => changeProductField('stock', value)} style={styles.flexInput} />
          </View>
          <Pressable onPress={pickProductImage} style={[styles.productImagePicker, { borderColor: line, backgroundColor: darkMode ? palette.dark : overlay.soft }]}>
            {productForm.imageUri ? (
              <Image source={{ uri: productForm.imageUri }} style={styles.productImagePreview} resizeMode="cover" />
            ) : (
              <View style={styles.productImageEmpty}>
                <Text style={styles.productImageIcon}>📷</Text>
                <Text style={[styles.productImageText, { color: colors.text }]}>Televerser une image article</Text>
                <Text style={[styles.productImageHint, { color: muted }]}>L'image sera visible dans la vitrine et la recherche.</Text>
              </View>
            )}
          </Pressable>
          <TextInput label="Description article" value={productForm.description} onChangeText={(value) => changeProductField('description', value)} multiline />
          <Button mode="contained" onPress={publishProduct} loading={publishing} buttonColor={colors.primary} textColor={colors.background}>
            Publier l'article
          </Button>
        </Surface>

        <SectionHeader title="Historique des achats" description="Tes derniers paiements Camazones sont visibles ici." />
        <View style={styles.purchaseSummary}>
          <Surface style={[styles.purchaseHero, { backgroundColor: darkMode ? palette.darkSurface : overlay.orange, borderColor: line }]}>
            <View>
              <Text style={[styles.purchaseHeroLabel, { color: muted }]}>Achats Camazones</Text>
              <Text style={[styles.purchaseHeroValue, { color: colors.text }]}>{purchaseHistory.length}</Text>
            </View>
            <View style={[styles.purchaseIcon, { backgroundColor: colors.primary }]}>
              <Text style={[styles.purchaseIconText, { color: colors.background }]}>🧾</Text>
            </View>
          </Surface>
        </View>
        <View style={styles.stack}>
          {purchaseHistory.length ? (
            purchaseHistory.slice(0, 8).map((transaction) => (
              <Pressable key={transaction.id} onPress={() => navigation.navigate('Wallet', { productTitle: transaction.label })}>
                <Surface style={[styles.purchaseCard, { backgroundColor: surface, borderColor: line }]}>
                  <View style={styles.purchaseLeft}>
                    <View style={[styles.purchaseThumb, { backgroundColor: darkMode ? palette.dark : overlay.green }]}>
                      <Text style={styles.purchaseThumbText}>✓</Text>
                    </View>
                    <View style={styles.purchaseCopy}>
                      <Text style={[styles.historyTitle, { color: colors.text }]}>{transaction.label}</Text>
                      <Text style={[styles.historyDate, { color: muted }]}>{new Date(transaction.at).toLocaleString('fr-FR')}</Text>
                    </View>
                  </View>
                  <View style={styles.purchaseRight}>
                    <Text style={[styles.purchaseAmount, { color: colors.primary }]}>{money(Math.abs(transaction.amount))}</Text>
                    <Text style={[styles.purchaseStatus, { color: colors.green ?? palette.green }]}>Payé</Text>
                    <Pressable onPress={() => downloadReceipt(transaction)} style={[styles.receiptButton, { borderColor: colors.green ?? palette.green }]}>
                      <Text style={[styles.receiptButtonText, { color: colors.green ?? palette.green }]}>PDF</Text>
                    </Pressable>
                  </View>
                </Surface>
              </Pressable>
            ))
          ) : (
            <Surface style={[styles.emptyPurchase, { backgroundColor: surface, borderColor: line }]}>
              <Text style={[styles.emptyPurchaseTitle, { color: colors.text }]}>Aucun achat pour le moment</Text>
              <Text style={[styles.emptyPurchaseText, { color: muted }]}>Tes paiements Camazones apparaitront ici apres validation.</Text>
            </Surface>
          )}
        </View>

        <SectionHeader title="Activité du profil" description={t('profileHistoryText')} />
        <View style={styles.stack}>
          {changeHistory.length ? (
            changeHistory.map((item) => (
              <Surface key={item.id} style={[styles.historyCard, { backgroundColor: surface, borderColor: line }]}>
                <Text style={[styles.historyTitle, { color: colors.text }]}>{item.labelKey ? t(item.labelKey) : item.label}</Text>
                <Text style={[styles.historyDate, { color: muted }]}>{new Date(item.at).toLocaleString('fr-FR')}</Text>
              </Surface>
            ))
          ) : (
            <Text style={[styles.subtitle, { color: muted }]}>{t('noProfileChange')}</Text>
          )}
        </View>

        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>{t('separatedProfiles')}</Text>
          <Text style={[styles.sectionLead, { color: colors.text }]}>{t('profileLogicTitle')}</Text>
          <Text style={[styles.subtitle, { color: muted }]}>{t('profileLogicText')}</Text>
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
                  <Text style={[styles.typeTitle, { color: active ? colors.background : colors.text }]}>{t(`${item.id}AccountLabel`)}</Text>
                </View>
                <Text style={[styles.typeText, { color: active ? colors.background : muted }]}>{t(`${item.id}AccountText`)}</Text>
              </Pressable>
            );
          })}
        </View>

        {isProfessional ? (
          <>
            <SectionHeader title={t('professionalShops')} description={t('professionalShopsText')} />
            <View style={styles.stack}>
              {professionalShops.map((shop) => (
                <Surface key={shop.id} style={[styles.shopLine, { backgroundColor: surface, borderColor: line }]}>
                  <View style={styles.typeTop}>
                    <Text style={[styles.profileName, { color: colors.text }]}>{shop.name}</Text>
                    {shop.premium ? <Text style={styles.star}>★</Text> : null}
                  </View>
                  <Text style={[styles.profileMeta, { color: muted }]}>{shop.city} · {shop.products.length} {t('items')}</Text>
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
            <SectionHeader title={t('independentSellers')} description={t('independentSellersText')} />
            <View style={styles.stack}>
              {independentSellers.map((seller) => (
                <Surface key={seller.id} style={[styles.sellerCard, { backgroundColor: surface, borderColor: line }]}>
                  <View style={styles.profileTop}>
                    <Image source={seller.avatar} style={styles.sellerPhoto} resizeMode="cover" />
                    <View style={styles.profileCopy}>
                      <Text style={[styles.profileName, { color: colors.text }]}>{seller.name}</Text>
                      <Text style={[styles.profileMeta, { color: muted }]}>{seller.city} · {t('withoutStorefront')}</Text>
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: overlay.soft,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: '900',
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
  publishCard: {
    gap: 12,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '900',
  },
  productImagePicker: {
    minHeight: 150,
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  productImagePreview: {
    width: '100%',
    height: 170,
  },
  productImageEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 6,
  },
  productImageIcon: {
    fontSize: 26,
    lineHeight: 30,
  },
  productImageText: {
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  productImageHint: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 17,
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
  gamesCard: {
    minHeight: 76,
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
    minWidth: 18,
    textAlign: 'right',
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
  purchaseSummary: {
    gap: 12,
  },
  purchaseHero: {
    minHeight: 92,
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  purchaseHeroLabel: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  purchaseHeroValue: {
    marginTop: 4,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '900',
  },
  purchaseIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseIconText: {
    fontSize: 21,
    lineHeight: 24,
  },
  purchaseCard: {
    minHeight: 74,
    padding: 13,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  purchaseLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  purchaseThumb: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseThumbText: {
    color: palette.green,
    fontSize: 18,
    fontWeight: '900',
  },
  purchaseCopy: {
    flex: 1,
  },
  purchaseRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  purchaseAmount: {
    fontSize: 13,
    fontWeight: '900',
  },
  purchaseStatus: {
    fontSize: 11,
    fontWeight: '900',
  },
  receiptButton: {
    marginTop: 3,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  receiptButtonText: {
    fontSize: 11,
    fontWeight: '900',
  },
  emptyPurchase: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 5,
  },
  emptyPurchaseTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  emptyPurchaseText: {
    lineHeight: 20,
    fontWeight: '700',
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
