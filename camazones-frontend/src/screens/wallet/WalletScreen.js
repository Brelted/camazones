import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Surface, Text, TextInput } from '../../components/ui';
import { Badge, SectionHeader } from '../../components/MarketplaceCards';
import { paymentMethods } from '../../data/marketplace';
import { darkPalette, overlay, palette } from '../../theme';

export default function WalletScreen({ route, appSettings }) {
  const balance = useSelector((state) => state.wallet.balance);
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);
  const [paid, setPaid] = useState(false);
  const [form, setForm] = useState({
    phone: '+237 6 90 00 00 00',
    card: '4242 4242 4242 4242',
    expiry: '12/28',
    name: 'ALAN CAMAZONES',
  });

  const productTitle = route?.params?.productTitle ?? 'Sac Kaya';
  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const surface = darkMode ? darkPalette.surface : overlay.surface;
  const selected = paymentMethods.find((method) => method.id === selectedMethod) ?? paymentMethods[0];
  const subtotal = 35000;
  const delivery = 1500;
  const fees = selectedMethod === 'wallet' ? 0 : 350;
  const total = subtotal + delivery + fees;

  const screenStyle = useMemo(() => [styles.screen, { backgroundColor: colors.background }], [colors.background]);
  const money = (value) => `${value.toLocaleString('fr-FR')} FCFA`;
  const changeField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <SafeAreaView style={screenStyle}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>Paiement</Text>
          <Text style={[styles.title, { color: colors.text }]}>Un checkout simple, local et credible.</Text>
          <Text style={[styles.subtitle, { color: muted }]}>
            Le paiement reste dans le parcours Camazones sans dupliquer le portefeuille existant.
          </Text>
        </View>

        <Surface style={[styles.checkoutCard, { backgroundColor: surface, borderColor: line }]} elevation={0}>
          <View style={styles.checkoutTop}>
            <View style={[styles.paymentIcon, { backgroundColor: colors.primary }]}>
              <Text style={[styles.paymentIconText, { color: colors.background }]}>✓</Text>
            </View>
            <View style={styles.checkoutCopy}>
              <Text style={[styles.checkoutTitle, { color: colors.text }]}>{productTitle}</Text>
              <Text style={[styles.checkoutMeta, { color: muted }]}>Commande protegee · vendeur verifiable</Text>
            </View>
            <Badge type="ap" />
          </View>

          <View style={styles.summary}>
            <Row label="Sous-total" value={money(subtotal)} muted={muted} color={colors.text} />
            <Row label="Livraison estimee" value={money(delivery)} muted={muted} color={colors.text} />
            <Row label="Frais paiement" value={money(fees)} muted={muted} color={colors.text} />
          </View>

          <View style={[styles.totalRow, { borderTopColor: line }]}>
            <Text style={[styles.totalLabel, { color: muted }]}>Total a payer</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>{money(total)}</Text>
          </View>

          <View style={[styles.balanceBox, { backgroundColor: darkMode ? palette.dark : overlay.green }]}>
            <Text style={[styles.balanceLabel, { color: muted }]}>Solde Camazones disponible</Text>
            <Text style={[styles.balanceValue, { color: colors.green ?? palette.green }]}>{money(balance)}</Text>
          </View>
        </Surface>

        <SectionHeader title="Methode de paiement" description="Orange Money, MTN MoMo, carte ou portefeuille." />
        <View style={styles.methods}>
          {paymentMethods.map((method) => {
            const isActive = selectedMethod === method.id;

            return (
              <Pressable
                key={method.id}
                onPress={() => {
                  setSelectedMethod(method.id);
                  setPaid(false);
                }}
                style={[
                  styles.methodCard,
                  {
                    borderColor: isActive ? colors.primary : line,
                    backgroundColor: isActive ? colors.primary : surface,
                  },
                ]}
              >
                <View style={styles.methodTop}>
                  <Text style={[styles.methodIcon, { fontSize: 15 }]}>{method.icon}</Text>
                  <Text style={[styles.methodTitle, { color: isActive ? colors.background : colors.text }]}>{method.label}</Text>
                </View>
                <Text style={[styles.methodText, { color: isActive ? colors.background : muted }]}>{method.detail}</Text>
              </Pressable>
            );
          })}
        </View>

        <Surface style={[styles.formCard, { backgroundColor: surface, borderColor: line }]} elevation={0}>
          <View style={styles.formHeader}>
            <Text style={[styles.formTitle, { color: colors.text }]}>{selected.label}</Text>
            <Text style={styles.formIcon}>{selected.icon}</Text>
          </View>

          {selectedMethod === 'card' ? (
            <View style={styles.form}>
              <TextInput label="Nom sur la carte" value={form.name} onChangeText={(value) => changeField('name', value)} autoCapitalize="characters" />
              <TextInput label="Numero carte" value={form.card} onChangeText={(value) => changeField('card', value)} keyboardType="number-pad" />
              <TextInput label="Expiration" value={form.expiry} onChangeText={(value) => changeField('expiry', value)} keyboardType="numbers-and-punctuation" />
            </View>
          ) : selectedMethod === 'wallet' ? (
            <View style={styles.form}>
              <TextInput label="Code PIN portefeuille" value="••••" onChangeText={() => {}} secureTextEntry />
              <Text style={[styles.providerNote, { color: muted }]}>Le solde est verifie avant validation.</Text>
            </View>
          ) : (
            <View style={styles.form}>
              <TextInput label="Numero mobile money" value={form.phone} onChangeText={(value) => changeField('phone', value)} keyboardType="phone-pad" />
              <Text style={[styles.providerNote, { color: muted }]}>Un code OTP sera demande par {selected.label}.</Text>
            </View>
          )}
        </Surface>

        <Surface style={[styles.securityCard, { backgroundColor: overlay.orange, borderColor: palette.orange }]} elevation={0}>
          <Text style={styles.securityTitle}>Protection achat</Text>
          <Text style={styles.securityText}>
            Le paiement est confirme avant l echange, le DM vendeur reste accessible et le recu est conserve.
          </Text>
        </Surface>

        {paid ? (
          <Surface style={[styles.successCard, { backgroundColor: overlay.green, borderColor: palette.green }]} elevation={0}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Paiement simule confirme</Text>
            <Text style={styles.successText}>Le parcours est pret pour brancher le provider reel.</Text>
          </Surface>
        ) : null}

        <Button
          mode="contained"
          onPress={() => setPaid(true)}
          buttonColor={colors.primary}
          textColor={colors.background}
          contentStyle={styles.buttonContent}
        >
          Payer {money(total)}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, muted, color }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: muted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color }]}>{value}</Text>
    </View>
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
  header: {
    gap: 9,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    letterSpacing: -0.9,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  checkoutCard: {
    gap: 14,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
  },
  checkoutTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  checkoutCopy: {
    flex: 1,
    gap: 2,
  },
  paymentIconText: {
    fontSize: 19,
    fontWeight: '900',
  },
  checkoutTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  checkoutMeta: {
    fontSize: 12,
    fontWeight: '700',
  },
  summary: {
    gap: 9,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLabel: {
    fontWeight: '700',
  },
  rowValue: {
    fontWeight: '900',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontWeight: '800',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  balanceBox: {
    padding: 12,
    borderRadius: 16,
  },
  balanceLabel: {
    fontWeight: '700',
  },
  balanceValue: {
    marginTop: 3,
    fontSize: 18,
    fontWeight: '900',
  },
  methods: {
    gap: 10,
  },
  methodCard: {
    gap: 8,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  methodTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  methodIcon: {
    lineHeight: 18,
  },
  methodText: {
    lineHeight: 19,
  },
  formCard: {
    gap: 12,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  formIcon: {
    fontSize: 16,
    lineHeight: 18,
  },
  form: {
    gap: 10,
  },
  providerNote: {
    lineHeight: 20,
  },
  securityCard: {
    gap: 5,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  securityTitle: {
    color: palette.text,
    fontWeight: '900',
  },
  securityText: {
    color: overlay.muted,
    lineHeight: 20,
  },
  successCard: {
    alignItems: 'center',
    gap: 5,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  successIcon: {
    color: palette.green,
    fontSize: 24,
    fontWeight: '900',
  },
  successTitle: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '900',
  },
  successText: {
    color: overlay.muted,
    textAlign: 'center',
  },
  buttonContent: {
    minHeight: 48,
  },
});
