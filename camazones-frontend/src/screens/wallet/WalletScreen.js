import React, { useEffect, useMemo, useState } from 'react';
import * as Speech from 'expo-speech';
import { Alert, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AnimatedBackdrop from '../../components/AnimatedBackdrop';
import { Button, Surface, Text, TextInput } from '../../components/ui';
import { Badge, SectionHeader } from '../../components/MarketplaceCards';
import { paymentMethods } from '../../data/visualAssets';
import { sendPurchaseReceiptEmail } from '../../services/notificationService';
import { createStripeCheckoutSession, parseFcfaAmount } from '../../services/paymentService';
import { exportInvoicePdf } from '../../services/pdfService';
import { payOrder, rechargeWallet, saveInvoice } from '../../store/slices/walletSlice';
import { darkPalette, overlay, palette } from '../../theme';

export default function WalletScreen({ route, appSettings }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { balance, transactions, lastInvoice } = useSelector((state) => state.wallet);
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);
  const [paid, setPaid] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [stripeSession, setStripeSession] = useState(null);
  const [cardFallbackReady, setCardFallbackReady] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('10000');
  const [form, setForm] = useState({
    phone: user?.phone ?? user?.phoneNumber ?? '',
    card: '',
    expiry: '12/28',
    cvc: '',
    name: `${user?.firstName ?? 'ALAN'} ${user?.lastName ?? 'CAMAZONES'}`.trim().toUpperCase(),
  });

  const productTitle = route?.params?.productTitle ?? 'Commande Camazones';
  const negotiatedPrice = parseFcfaAmount(route?.params?.negotiatedPrice);
  const sellerName = route?.params?.sellerName;
  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const surface = darkMode ? darkPalette.surface : overlay.surface;
  const selected = paymentMethods.find((method) => method.id === selectedMethod) ?? paymentMethods[0];
  const subtotal = negotiatedPrice || parseFcfaAmount(route?.params?.productPrice) || 35000;
  const delivery = 1500;
  const fees = selectedMethod === 'wallet' ? 0 : 350;
  const total = subtotal + delivery + fees;
  const t = appSettings?.t ?? ((key) => key);
  const screenStyle = useMemo(() => [styles.screen, { backgroundColor: colors.background }], [colors.background]);
  const money = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`;
  const customerName = `${user?.firstName ?? 'Client'} ${user?.lastName ?? 'Camazones'}`.trim();
  const customerEmail = user?.email ?? 'client@camazones.demo';
  const userTransactions = transactions.filter((transaction) => transaction.email === customerEmail);

  useEffect(() => {
    const userPhone = user?.phone ?? user?.phoneNumber;
    if (userPhone && !form.phone) {
      setForm((current) => ({ ...current, phone: userPhone }));
    }
  }, [form.phone, user?.phone, user?.phoneNumber]);

  const changeField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const formatCardNumber = (value) => value.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };
  const formatCvc = (value) => value.replace(/\D/g, '').slice(0, 4);

  const validateCardForm = () => {
    const cardDigits = form.card.replace(/\D/g, '');
    const expiryParts = form.expiry.split('/');
    const month = Number(expiryParts[0]);
    const year = Number(expiryParts[1]);
    const cvcDigits = form.cvc.replace(/\D/g, '');

    if (!form.name.trim()) {
      return 'Entre le nom inscrit sur la carte.';
    }
    if (cardDigits.length < 13) {
      return 'Entre un numéro de carte valide.';
    }
    if (!month || month < 1 || month > 12 || !year || expiryParts[1]?.length !== 2) {
      return 'Entre une date valide au format MM/AA.';
    }
    if (cvcDigits.length < 3) {
      return 'Entre le code CVV/CVC.';
    }
    return null;
  };

  const recharge = async () => {
    const amount = Number(rechargeAmount.replace(/[^0-9]/g, ''));
    if (!amount || amount < 500) {
      Alert.alert('Montant invalide', 'Entre au moins 500 FCFA.');
      return;
    }
    await dispatch(rechargeWallet({ amount, label: `Recharge ${selected.label}` }));
    Alert.alert('Recharge ajoutée', `${money(amount)} ajouté au portefeuille Camazone.`);
  };

  const completeLocalPayment = async ({ methodLabel = selected.label, transactionId = `CMZ-${Date.now()}`, fromWallet = selectedMethod === 'wallet' } = {}) => {
    const invoice = {
      id: transactionId,
      productTitle: negotiatedPrice ? `${productTitle} - prix négocié` : productTitle,
      total: money(total),
      method: methodLabel,
      customerName,
      email: customerEmail,
    };
    await dispatch(payOrder({ amount: total, label: invoice.productTitle, fromWallet, invoice }));
    sendPurchaseReceiptEmail({
      email: customerEmail,
      customerName,
      productTitle: invoice.productTitle,
      total: money(total),
      method: methodLabel,
      transactionId: invoice.id,
    }).catch(() => {});
    setPaid(true);
    Speech.speak('Paiement effectué avec succès. Votre reçu est prêt.', {
      language: appSettings?.language === 'en' ? 'en-US' : 'fr-FR',
      rate: 0.92,
    });
  };

  const pay = async () => {
    if (selectedMethod === 'wallet' && balance < total) {
      Alert.alert('Solde insuffisant', 'Recharge le portefeuille ou choisis un autre moyen de paiement.');
      return;
    }

    if (selectedMethod === 'card') {
      const cardError = validateCardForm();
      if (cardError) {
        Alert.alert('Carte incomplète', cardError);
        return;
      }

      setProcessingPayment(true);
      setCardFallbackReady(false);
      try {
        const session = await createStripeCheckoutSession({
          productTitle,
          amount: total,
          customerEmail,
          customerName,
        });
        setStripeSession(session);
        await Linking.openURL(session.checkoutUrl);
        Alert.alert('Stripe ouvert', 'Finalise le paiement carte dans Stripe Checkout, puis reviens confirmer le reçu.');
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'Stripe indisponible.';
        if (message.includes('STRIPE_SECRET_KEY') || message.toLowerCase().includes('stripe non configur')) {
          setCardFallbackReady(true);
          Alert.alert('Stripe non configuré', 'Ajoute une clé Stripe valide côté backend. Le bouton démo reste disponible pour tester le reçu.');
        } else {
          Alert.alert('Stripe indisponible', message);
        }
      } finally {
        setProcessingPayment(false);
      }
      return;
    }

    await completeLocalPayment();
  };

  const confirmStripePayment = async () => {
    await completeLocalPayment({
      methodLabel: 'Stripe Checkout',
      transactionId: stripeSession?.sessionId ?? `STRIPE-${Date.now()}`,
      fromWallet: false,
    });
  };

  const confirmCardTestPayment = async () => {
    await completeLocalPayment({
      methodLabel: 'Carte bancaire test',
      transactionId: `CARD-${Date.now()}`,
      fromWallet: false,
    });
    setCardFallbackReady(false);
  };

  const exportPdf = async () => {
    const invoice = lastInvoice ?? {
      id: `CMZ-${Date.now()}`,
      productTitle,
      total: money(total),
      method: selected.label,
      customerName,
      email: customerEmail,
    };
    const uri = await exportInvoicePdf({
      productTitle: invoice.productTitle,
      total: invoice.total,
      method: invoice.method,
      transactionId: invoice.id,
      customerName: invoice.customerName ?? customerName,
      email: invoice.email ?? customerEmail,
    });
    await dispatch(saveInvoice({ ...invoice, uri }));
  };

  const exportTransactionPdf = async (transaction) => {
    const invoice = transaction.invoice ?? {
      id: transaction.id,
      productTitle: transaction.label,
      total: money(Math.abs(transaction.amount)),
      method: transaction.method ?? 'Camazone Pay',
      customerName,
      email: customerEmail,
    };
    const uri = await exportInvoicePdf({
      productTitle: invoice.productTitle,
      total: invoice.total,
      method: invoice.method,
      transactionId: invoice.id,
      customerName: invoice.customerName ?? customerName,
      email: invoice.email ?? customerEmail,
    });
    await dispatch(saveInvoice({ ...invoice, uri }));
  };

  return (
    <SafeAreaView style={screenStyle}>
      <AnimatedBackdrop colors={colors} darkMode={darkMode} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>{t('wallet')}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{t('walletTitle')}</Text>
          <Text style={[styles.subtitle, { color: muted }]}>{t('walletSubtitle')}</Text>
        </View>

        <Surface style={[styles.checkoutCard, { backgroundColor: surface, borderColor: line }]}>
          <View style={styles.checkoutTop}>
            <View style={[styles.paymentIcon, { backgroundColor: colors.primary }]}>
              <Text style={[styles.paymentIconText, { color: colors.background }]}>{selected.icon}</Text>
            </View>
            <View style={styles.checkoutCopy}>
              <Text style={[styles.checkoutTitle, { color: colors.text }]}>{productTitle}</Text>
              <Text style={[styles.checkoutMeta, { color: muted }]}>
                {negotiatedPrice ? `Offre acceptée par ${sellerName ?? 'le vendeur'}` : t('protectedOrder')}
              </Text>
            </View>
            <Badge type="ap" />
          </View>

          <View style={styles.summary}>
            <Row label={t('subtotal')} value={money(subtotal)} muted={muted} color={colors.text} />
            <Row label={t('delivery')} value={money(delivery)} muted={muted} color={colors.text} />
            <Row label={t('paymentFees')} value={money(fees)} muted={muted} color={colors.text} />
          </View>

          {negotiatedPrice ? (
            <View style={[styles.negotiationBox, { backgroundColor: darkMode ? palette.darkSurface : overlay.soft, borderColor: line }]}>
              <Text style={styles.negotiationIcon}>🤝</Text>
              <Text style={[styles.negotiationText, { color: colors.text }]}>
                Le paiement utilise le prix réduit validé dans la discussion.
              </Text>
            </View>
          ) : null}

          <View style={[styles.totalRow, { borderTopColor: line }]}>
            <Text style={[styles.totalLabel, { color: muted }]}>{t('totalToPay')}</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>{money(total)}</Text>
          </View>

          <View style={[styles.balanceBox, { backgroundColor: darkMode ? palette.dark : overlay.soft }]}>
            <Text style={[styles.balanceLabel, { color: muted }]}>{t('camazonesBalance')}</Text>
            <Text style={[styles.balanceValue, { color: colors.secondary ?? palette.secondary }]}>{money(balance)}</Text>
          </View>
        </Surface>

        <SectionHeader title={t('topUpWallet')} description={t('topUpWalletDescription')} />
        <Surface style={[styles.formCard, { backgroundColor: surface, borderColor: line }]}>
          <TextInput label={t('topUpAmount')} value={rechargeAmount} onChangeText={(value) => setRechargeAmount(value.replace(/[^0-9]/g, ''))} keyboardType="number-pad" />
          <Button mode="contained" onPress={recharge} buttonColor={colors.secondary ?? palette.secondary} textColor={colors.background}>
            {t('recharge')}
          </Button>
        </Surface>

        <SectionHeader title={t('paymentMethod')} description={t('paymentMethodDescription')} />
        <View style={styles.methods}>
          {paymentMethods.map((method) => {
            const isActive = selectedMethod === method.id;
            return (
              <Pressable
                key={method.id}
                onPress={() => {
                  setSelectedMethod(method.id);
                  setPaid(false);
                  setStripeSession(null);
                  setCardFallbackReady(false);
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
              <TextInput label={t('cardName')} value={form.name} onChangeText={(value) => changeField('name', value)} autoCapitalize="characters" />
              <TextInput label="Numéro de carte" value={form.card} onChangeText={(value) => changeField('card', formatCardNumber(value))} keyboardType="number-pad" placeholder="4242 4242 4242 4242" maxLength={23} />
              <View style={styles.cardSecurityRow}>
                <TextInput label="Expiration MM/AA" value={form.expiry} onChangeText={(value) => changeField('expiry', formatExpiry(value))} keyboardType="number-pad" maxLength={5} style={styles.flexInput} />
                <TextInput label="CVV/CVC" value={form.cvc} onChangeText={(value) => changeField('cvc', formatCvc(value))} keyboardType="number-pad" secureTextEntry maxLength={4} style={styles.flexInput} />
              </View>
              <Text style={[styles.providerNote, { color: muted }]}>Paiement sécurisé via Stripe Checkout.</Text>
            </View>
          ) : selectedMethod === 'wallet' ? (
            <View style={styles.form}>
              <TextInput label={t('walletPin')} value="••••" onChangeText={() => {}} secureTextEntry />
              <Text style={[styles.providerNote, { color: muted }]}>{t('balanceChecked')}</Text>
            </View>
          ) : (
            <View style={styles.form}>
              <TextInput label={t('mobileMoneyNumber')} value={form.phone} onChangeText={(value) => changeField('phone', value)} keyboardType="phone-pad" />
              <Text style={[styles.providerNote, { color: muted }]}>Le code OTP sera envoyé sur ce numéro.</Text>
            </View>
          )}
        </Surface>

        {paid ? (
          <Surface style={[styles.successCard, { backgroundColor: darkMode ? palette.darkSurface : overlay.soft, borderColor: colors.secondary ?? palette.secondary }]}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={[styles.successTitle, { color: colors.text }]}>{t('paymentConfirmed')}</Text>
            <Text style={[styles.successText, { color: muted }]}>{t('invoiceReady')}</Text>
            <Button mode="outlined" onPress={exportPdf} textColor={colors.secondary ?? palette.secondary} style={[styles.pdfButton, { borderColor: colors.secondary ?? palette.secondary }]}>
              {t('invoicePdf')}
            </Button>
          </Surface>
        ) : null}

        {stripeSession && !paid ? (
          <Surface style={[styles.successCard, { backgroundColor: darkMode ? palette.darkSurface : overlay.soft, borderColor: line }]}>
            <Text style={styles.formIcon}>💳</Text>
            <Text style={[styles.successTitle, { color: colors.text }]}>Stripe Checkout lancé</Text>
            <Text style={[styles.successText, { color: muted }]}>Confirme ici après validation dans Stripe pour générer le reçu.</Text>
            <Button mode="contained" onPress={confirmStripePayment} buttonColor={colors.secondary ?? palette.secondary} textColor={colors.background}>
              Confirmer le reçu Stripe
            </Button>
          </Surface>
        ) : null}

        {cardFallbackReady && !paid ? (
          <Surface style={[styles.successCard, { backgroundColor: darkMode ? palette.darkSurface : overlay.orange, borderColor: colors.primary }]}>
            <Text style={styles.formIcon}>💳</Text>
            <Text style={[styles.successTitle, { color: colors.text }]}>Mode démo carte</Text>
            <Text style={[styles.successText, { color: muted }]}>Stripe n’est pas actif côté backend. Cette action crée seulement un reçu démo.</Text>
            <Button mode="contained" onPress={confirmCardTestPayment} buttonColor={colors.primary} textColor={colors.background}>
              Valider paiement carte test
            </Button>
          </Surface>
        ) : null}

        <Button mode="contained" onPress={pay} loading={processingPayment} buttonColor={colors.primary} textColor={colors.background} contentStyle={styles.buttonContent} style={styles.payButton}>
          Payer {money(total)}
        </Button>

        <SectionHeader title={t('history')} description={t('walletHistoryDescription')} />
        <View style={styles.history}>
          {userTransactions.length ? (
            userTransactions.map((transaction) => (
              <Surface key={transaction.id} style={[styles.transactionCard, { backgroundColor: surface, borderColor: line }]}>
                <View>
                  <Text style={[styles.transactionTitle, { color: colors.text }]}>{transaction.label}</Text>
                  <Text style={[styles.transactionDate, { color: muted }]}>{new Date(transaction.at).toLocaleString('fr-FR')}</Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={[styles.transactionAmount, { color: transaction.amount > 0 ? colors.secondary ?? palette.secondary : palette.orange }]}>
                    {money(transaction.amount)}
                  </Text>
                  {transaction.type === 'payment' ? (
                    <Pressable onPress={() => exportTransactionPdf(transaction)} style={[styles.pdfChip, { borderColor: colors.secondary ?? palette.secondary }]}>
                      <Text style={[styles.pdfChipText, { color: colors.secondary ?? palette.secondary }]}>PDF</Text>
                    </Pressable>
                  ) : null}
                </View>
              </Surface>
            ))
          ) : (
            <Text style={[styles.subtitle, { color: muted }]}>{t('noOperation')}</Text>
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
    fontSize: 18,
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
  negotiationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 11,
    borderRadius: 15,
    borderWidth: 1,
  },
  negotiationIcon: {
    fontSize: 20,
  },
  negotiationText: {
    flex: 1,
    lineHeight: 19,
    fontWeight: '800',
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
    fontSize: 18,
    lineHeight: 22,
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
    fontSize: 18,
    lineHeight: 22,
  },
  form: {
    gap: 10,
  },
  cardSecurityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  flexInput: {
    flex: 1,
  },
  providerNote: {
    lineHeight: 20,
    fontWeight: '700',
  },
  successCard: {
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  successIcon: {
    fontSize: 24,
    fontWeight: '900',
  },
  successTitle: {
    fontSize: 17,
    fontWeight: '900',
  },
  successText: {
    textAlign: 'center',
  },
  pdfButton: {
    alignSelf: 'stretch',
  },
  buttonContent: {
    minHeight: 48,
  },
  payButton: {
    marginTop: 8,
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
  transactionRight: {
    alignItems: 'flex-end',
    gap: 7,
  },
  pdfChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pdfChipText: {
    fontSize: 11,
    fontWeight: '900',
  },
});
