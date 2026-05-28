import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Switch, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createProduct } from '../../store/slices/productsSlice';

const ORANGE = '#FF6B35';

const CATEGORIES = [
  { label: 'Électronique', value: 'electronics', icon: '📱' },
  { label: 'Mode',         value: 'fashion',     icon: '👗' },
  { label: 'Alimentation', value: 'food',        icon: '🥗' },
  { label: 'Artisanat',    value: 'crafts',      icon: '🎨' },
  { label: 'Agricole',     value: 'agriculture', icon: '🌾' },
  { label: 'Maison',       value: 'home',        icon: '🏠' },
];

const CITIES = ['Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Garoua', 'Ngaoundéré', 'Bertoua'];

export default function PublishProductScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isCreating, error } = useSelector((s) => s.products);

  const [form, setForm] = useState({
    title:       '',
    description: '',
    category:    '',
    price:       '',
    city:        '',
    stock:       '',
    negotiable:  false,
  });

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [cityOpen,     setCityOpen]     = useState(false);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Validation ────────────────────────────────────────────────────────────

  function validate() {
    if (!form.title.trim()) {
      Alert.alert('Champ requis', 'Le titre est obligatoire.'); return false;
    }
    const priceVal = parseFloat(form.price);
    if (!form.price || isNaN(priceVal) || priceVal <= 0) {
      Alert.alert('Prix invalide', 'Veuillez entrer un prix valide.'); return false;
    }
    if (!form.category) {
      Alert.alert('Champ requis', 'Veuillez choisir une catégorie.'); return false;
    }
    return true;
  }

  // ── Soumission ────────────────────────────────────────────────────────────

  async function onSubmit() {
    if (!validate()) return;

    const payload = {
      title:       form.title.trim(),
      description: form.description.trim() || null,
      category:    form.category,
      price:       parseFloat(form.price),
      city:        form.city || null,
      stock:       form.stock ? parseInt(form.stock, 10) : null,
      negotiable:  form.negotiable,
    };

    const result = await dispatch(createProduct(payload));
    if (!result.error) {
      Alert.alert('✅ Publié !', 'Votre produit est maintenant en ligne.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }

  // ── Rendu ─────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Erreur API */}
        {!!error && (
          <View style={styles.errorBanner}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#E63946" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* ── Titre ── */}
        <Text style={styles.fieldLabel}>Titre *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex : Téléphone Samsung Galaxy A54"
          placeholderTextColor="#bbb"
          value={form.title}
          onChangeText={(v) => set('title', v)}
          maxLength={100}
        />

        {/* ── Description ── */}
        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Décrivez votre produit (état, caractéristiques, etc.)..."
          placeholderTextColor="#bbb"
          value={form.description}
          onChangeText={(v) => set('description', v)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={1000}
        />

        {/* ── Catégorie ── */}
        <Text style={styles.fieldLabel}>Catégorie *</Text>
        <TouchableOpacity
          style={[styles.input, styles.selector]}
          onPress={() => { setCategoryOpen((o) => !o); setCityOpen(false); }}
        >
          <Text style={form.category ? styles.selectorValue : styles.selectorPlaceholder}>
            {form.category
              ? `${CATEGORIES.find((c) => c.value === form.category)?.icon}  ${CATEGORIES.find((c) => c.value === form.category)?.label}`
              : 'Choisir une catégorie'}
          </Text>
          <MaterialCommunityIcons
            name={categoryOpen ? 'chevron-up' : 'chevron-down'}
            size={20} color="#aaa"
          />
        </TouchableOpacity>
        {categoryOpen && (
          <View style={styles.dropdown}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[styles.dropItem, form.category === cat.value && styles.dropItemActive]}
                onPress={() => { set('category', cat.value); setCategoryOpen(false); }}
              >
                <Text style={styles.dropIcon}>{cat.icon}</Text>
                <Text style={[styles.dropLabel, form.category === cat.value && styles.dropLabelActive]}>
                  {cat.label}
                </Text>
                {form.category === cat.value && (
                  <MaterialCommunityIcons name="check" size={16} color={ORANGE} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Prix ── */}
        <Text style={styles.fieldLabel}>Prix *</Text>
        <View style={styles.priceRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Ex : 25000"
            placeholderTextColor="#bbb"
            value={form.price}
            onChangeText={(v) => set('price', v.replace(/[^0-9.]/g, ''))}
            keyboardType="numeric"
          />
          <View style={styles.currencyTag}>
            <Text style={styles.currencyText}>XAF</Text>
          </View>
        </View>

        {/* ── Ville ── */}
        <Text style={styles.fieldLabel}>Ville</Text>
        <TouchableOpacity
          style={[styles.input, styles.selector]}
          onPress={() => { setCityOpen((o) => !o); setCategoryOpen(false); }}
        >
          <Text style={form.city ? styles.selectorValue : styles.selectorPlaceholder}>
            {form.city ? `📍  ${form.city}` : 'Choisir une ville (optionnel)'}
          </Text>
          <MaterialCommunityIcons
            name={cityOpen ? 'chevron-up' : 'chevron-down'}
            size={20} color="#aaa"
          />
        </TouchableOpacity>
        {cityOpen && (
          <View style={styles.dropdown}>
            {/* Option "Pas de ville" */}
            <TouchableOpacity
              style={[styles.dropItem, !form.city && styles.dropItemActive]}
              onPress={() => { set('city', ''); setCityOpen(false); }}
            >
              <Text style={[styles.dropLabel, !form.city && styles.dropLabelActive]}>
                Pas de ville spécifiée
              </Text>
            </TouchableOpacity>
            {CITIES.map((city) => (
              <TouchableOpacity
                key={city}
                style={[styles.dropItem, form.city === city && styles.dropItemActive]}
                onPress={() => { set('city', city); setCityOpen(false); }}
              >
                <Text style={styles.dropIcon}>📍</Text>
                <Text style={[styles.dropLabel, form.city === city && styles.dropLabelActive]}>
                  {city}
                </Text>
                {form.city === city && (
                  <MaterialCommunityIcons name="check" size={16} color={ORANGE} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Stock ── */}
        <Text style={styles.fieldLabel}>Quantité disponible</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex : 3  (laisser vide si illimité)"
          placeholderTextColor="#bbb"
          value={form.stock}
          onChangeText={(v) => set('stock', v.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
        />

        {/* ── Négociable ── */}
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>Prix négociable</Text>
            <Text style={styles.switchSub}>Les acheteurs pourront vous soumettre une offre</Text>
          </View>
          <Switch
            value={form.negotiable}
            onValueChange={(v) => set('negotiable', v)}
            trackColor={{ false: '#ddd', true: ORANGE }}
            thumbColor="#fff"
          />
        </View>

        {/* ── Bouton publier ── */}
        <TouchableOpacity
          style={[styles.publishBtn, isCreating && styles.publishBtnDisabled]}
          onPress={onSubmit}
          disabled={isCreating}
          activeOpacity={0.85}
        >
          {isCreating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="rocket-launch-outline" size={22} color="#fff" />
              <Text style={styles.publishText}>Publier le produit</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 48 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll:    { padding: 16 },

  // Erreur
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFE8E8', borderRadius: 10, padding: 12, marginBottom: 16,
  },
  errorText: { color: '#E63946', fontSize: 13, flex: 1 },

  // Champs
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#2C3E50', marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e8e8e8',
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#2C3E50',
  },
  textarea: { height: 100 },

  // Sélecteur déroulant
  selector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectorValue:       { fontSize: 15, color: '#2C3E50', flex: 1 },
  selectorPlaceholder: { fontSize: 15, color: '#bbb', flex: 1 },

  // Dropdown
  dropdown: {
    backgroundColor: '#fff', borderRadius: 10, marginTop: 4,
    borderWidth: 1, borderColor: '#e8e8e8', overflow: 'hidden',
  },
  dropItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: '#f8f8f8',
  },
  dropItemActive: { backgroundColor: '#FFF3EE' },
  dropIcon:       { fontSize: 18 },
  dropLabel:      { fontSize: 14, color: '#555', flex: 1 },
  dropLabelActive:{ color: ORANGE, fontWeight: '700' },

  // Prix
  priceRow:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  currencyTag: {
    backgroundColor: '#F5F5F5', borderRadius: 10, borderWidth: 1, borderColor: '#e8e8e8',
    paddingHorizontal: 14, paddingVertical: 12,
  },
  currencyText: { fontSize: 15, fontWeight: '700', color: '#7F8C8D' },

  // Toggle négociable
  switchRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e8e8e8',
    padding: 14, marginTop: 14, gap: 12,
  },
  switchLabel: { fontSize: 14, fontWeight: '700', color: '#2C3E50' },
  switchSub:   { fontSize: 12, color: '#7F8C8D', marginTop: 2 },

  // Bouton publier
  publishBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    backgroundColor: ORANGE, borderRadius: 14, paddingVertical: 16, marginTop: 24,
    elevation: 4, shadowColor: ORANGE, shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8,
  },
  publishBtnDisabled: { opacity: 0.6 },
  publishText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.3 },
});
