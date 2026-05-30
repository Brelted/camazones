import React, { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Surface, Text, TextInput } from '../../components/ui';
import { Badge, SectionHeader } from '../../components/MarketplaceCards';
import { paymentMethods } from '../../data/marketplace';
import { exportInvoicePdf } from '../../services/pdfService';
import { payOrder, rechargeWallet, saveInvoice } from '../../store/slices/walletSlice';
import { darkPalette, overlay, palette } from '../../theme';

export default function WalletScreen({ route, appSettings }) {
  const dispatch = useDispatch();
  const { balance, transactions, lastInvoice } = useSelector((state) => state.wallet);
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);
  const [paid, setPaid] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('10000');
  const [form, setForm] = useState({
    phone: '+237 6 90 00 00 00',
    card: '4242 4242 4242 4242',
    expiry: '12/28',
    name: 'ALAN CAMAZONES',
  });

  const productTitle = route?.params?.productTitle ?? 'Commande Camazones';
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
  const t = appSettings?.t ?? ((key) => key);

  const screenStyle = useMemo(() => [styles.screen, { backgroundColor: colors.background }], [colors.background]);
  const money = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`;
  const changeField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const recharge = async () => {
    const amount = Number(rechargeAmount.replace(/[^0-9]/g, ''));
    if (!amount || amount < 500) {
      Alert.alert('Montant invalide', 'Entre au moins 500 FCFA.');
      return;
    }
    await dispatch(rechargeWallet({ amount, label: `Recharge ${selected.label}` }));
    Alert.alert('Recharge ajoutee', `${money(amount)} ajoute au portefeuille Camazones.`);
  };

  const pay = async () => {
    if (selectedMethod === 'wallet' && balance < total) {
      Alert.alert('Solde insuffisant', 'Recharge le portefeuille ou choisis un autre moyen de paiement.');
      return;
    }

    const invoice = {
      id: `CMZ-${Date.now()}`,
      productTitle,
      total: money(total),
      method: selected.label,
    };
    await dispatch(payOrder({ amount: total, label: productTitle, fromWallet: selectedMethod === 'wallet', invoice }));
    setPaid(true);
  };

  const exportPdf = async () => {
    const invoice = lastInvoice ?? {
      id: `CMZ-${Date.now()}`,
      productTitle,
      total: money(total),
      method: selected.label,
    };
    const uri = await exportInvoicePdf({
      productTitle: invoice.productTitle,
      total: invoice.total,
      method: invoice.method,
      transactionId: invoice.id,
    });
    await dispatch(saveInvoice({ ...invoice, uri }));
  };

  return (
    <SafeAreaView style={screenStyle}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>{t('wallet')}</Text>
          <Text style={[styles.title, { color: colors.text }]}>Paiement, recharge et facture au meme endroit.</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Pay est maintenant accessible depuis le profil, avec historique et export PDF.</Text>
        </View>

        <Surface style={[styles.checkoutCard, { backgroundColor: surface, borderColor: line }]}>
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
            <Text style={[styles.balanceLabel, { color: muted }]}>Solde Camazones</Text>
            <Text style={[styles.balanceValue, { color: colors.green ?? palette.green }]}>{money(balance)}</Text>
          </View>
        </Surface>

        <SectionHeader title="Recharger le portefeuille" description="Ajoute de l argent avant de payer avec le solde Camazones." />
        <Surface style={[styles.formCard, { backgroundColor: surface, borderColor: line }]}>
          <TextInput label="Montant recharge" value={rechargeAmount} onChangeText={(value) => setRechargeAmount(value.replace(/[^0-9]/g, ''))} keyboardType="number-pad" />
          <Button mode="contained" onPress={recharge} buttonColor={colors.green ?? palette.green} textColor={colors.background}>
            {t('recharge')}
          </Button>
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
                  <Text style={styles.methodIcon}>{method.icon}</Text>
                  <Text style={[styles.methodTitle, { color: isActive ? colors.background : colors.text }]}>{method.label}</Text>
                </View>
                <Text style={[styles.methodText, { color: isActive ? colors.background : muted }]}>{method.detail}</Text>
              </Pressable>
            );
          })}
        </View>

        <Surface style={[styles.formCard, { backgroundColor: surface, borderColor: line }]}>
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

        {paid ? (
          <Surface style={[styles.successCard, { backgroundColor: overlay.green, borderColor: palette.green }]}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Paiement confirme</Text>
            <Text style={styles.successText}>La facture est prete a exporter en PDF.</Text>
            <Button mode="outlined" onPress={exportPdf} textColor={palette.green} style={styles.pdfButton}>
              {t('invoicePdf')}
            </Button>
          </Surface>
        ) : null}

        <Button mode="contained" onPress={pay} buttonColor={colors.primary} textColor={colors.background} contentStyle={styles.buttonContent}>
          Payer {money(total)}
        </Button>

        <SectionHeader title={t('history')} description="Recharges et depenses du portefeuille." />
        <View style={styles.history}>
          {transactions.length ? (
            transactions.map((transaction) => (
              <Surface key={transaction.id} style={[styles.transactionCard, { backgroundColor: surface, borderColor: line }]}>
                <View>
                  <Text style={[styles.transactionTitle, { color: colors.text }]}>{transaction.label}</Text>
                  <Text style={[styles.transactionDate, { color: muted }]}>{new Date(transaction.at).toLocaleString('fr-FR')}</Text>
                </View>
                <Text style={[styles.transactionAmount, { color: transaction.amount > 0 ? palette.green : palette.orange }]}>
                  {money(transaction.amount)}
                </Text>
              </Surface>
            ))
          ) : (
            <Text style={[styles.subtitle, { color: muted }]}>Aucune operation pour le moment.</Text>
          )}
        </View>
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
    paddingBottom: 92,
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
    fontSize: 14,
    lineHeight: 16,
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
    fontSize: 14,
    lineHeight: 16,
  },
  form: {
    gap: 10,
  },
  providerNote: {
    lineHeight: 20,
  },
  successCard: {
    alignItems: 'center',
    gap: 8,
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
  pdfButton: {
    alignSelf: 'stretch',
    borderColor: palette.green,
  },
  buttonContent: {
    minHeight: 48,
  },
  history: {
    gap: 10,
  },
  transactionCard: {
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  transactionTitle: {
    fontWeight: '900',
  },
  transactionDate: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '700',
  },
  transactionAmount: {
    fontWeight: '900',
  },
});
