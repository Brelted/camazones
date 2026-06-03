import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import AnimatedBackdrop from '../../components/AnimatedBackdrop';
import { Button, Surface, Text, TextInput } from '../../components/ui';
import { Badge, SectionHeader } from '../../components/MarketplaceCards';
import {
  fetchConversations,
  mapConversation,
  sendConversationMessage,
  sendNegotiatedOffer,
  startConversation,
} from '../../services/messageService';
import { darkPalette, overlay, palette } from '../../theme';

export default function MessagesScreen({ navigation, route, appSettings }) {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const startedRouteRef = useRef(null);
  const currentEmail = user?.email;
  const [conversationList, setConversationList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isOfferSending, setIsOfferSending] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [threadMessages, setThreadMessages] = useState({});
  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const surface = darkMode ? darkPalette.surface : overlay.surface;
  const t = appSettings?.t ?? ((key) => key);
  const canSendOffer = user?.role === 'SELLER' || user?.role === 'ADMIN';
  const money = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`;

  const upsertConversation = (conversation) => {
    setConversationList((current) => {
      const exists = current.some((item) => item.id === conversation.id);
      return exists ? current.map((item) => (item.id === conversation.id ? conversation : item)) : [conversation, ...current];
    });
    setThreadMessages((current) => ({ ...current, [conversation.id]: conversation.messages }));
    setSelectedId(conversation.id);
  };

  useEffect(() => {
    let alive = true;

    const loadRemoteConversations = async () => {
      if (!token) {
        return;
      }

      setIsSyncing(true);
      try {
        const payload = await fetchConversations();
        const mapped = payload.map((conversation) => mapConversation(conversation, currentEmail));
        if (!alive) {
          return;
        }
        setConversationList(mapped);
        setThreadMessages(
          mapped.reduce((accumulator, conversation) => {
            accumulator[conversation.id] = conversation.messages;
            return accumulator;
          }, {})
        );
        setSelectedId((current) => (mapped.some((conversation) => conversation.id === current) ? current : mapped[0]?.id ?? null));
      } catch (error) {
        if (alive) {
          setConversationList([]);
          setThreadMessages({});
          setSelectedId(null);
        }
      } finally {
        if (alive) {
          setIsSyncing(false);
        }
      }
    };

    loadRemoteConversations();
    return () => {
      alive = false;
    };
  }, [currentEmail, token]);

  useEffect(() => {
    const sellerName = route?.params?.sellerName;
    const sellerEmail = route?.params?.sellerEmail;
    const productTitle = route?.params?.productTitle;
    const routeKey = `${sellerEmail ?? sellerName ?? ''}:${productTitle ?? ''}`;
    const targetConversation = conversationList.find(
      (conversation) =>
        conversation.sellerEmail?.toLowerCase?.() === sellerEmail?.toLowerCase?.() ||
        conversation.sellerName === sellerName
    );

    if (targetConversation) {
      setSelectedId(targetConversation.id);
      return;
    }
    if (!sellerEmail || !token || startedRouteRef.current === routeKey) {
      return;
    }

    startedRouteRef.current = routeKey;
    startConversation({
      sellerEmail,
      productTitle,
      openingMessage: `Bonjour, je suis intéressé par ${productTitle ?? 'votre article'}.`,
    })
      .then((conversation) => upsertConversation(mapConversation(conversation, currentEmail)))
      .catch(() => {});
  }, [conversationList, currentEmail, route?.params?.productTitle, route?.params?.sellerEmail, route?.params?.sellerName, token]);

  const selectedConversation = useMemo(
    () => conversationList.find((conversation) => conversation.id === selectedId) ?? conversationList[0],
    [conversationList, selectedId]
  );
  const messages = threadMessages[selectedConversation?.id] ?? [];
  const offer = selectedConversation?.negotiatedOffer;

  const sendMessage = async () => {
    const cleanDraft = draft.trim();
    if (!cleanDraft || !selectedConversation) {
      return;
    }

    setIsSending(true);
    try {
      const response = await sendConversationMessage(selectedConversation.id, cleanDraft);
      upsertConversation(mapConversation(response, currentEmail));
      setDraft('');
    } catch (error) {
      Alert.alert('Message non envoyé', 'Vérifie que le backend est lancé puis réessaie.');
    } finally {
      setIsSending(false);
    }
  };

  const sendOffer = async () => {
    const amount = Number(String(offerAmount).replace(/[^0-9]/g, ''));
    if (!selectedConversation || amount < 100) {
      Alert.alert('Montant invalide', 'Entre un montant valide en FCFA.');
      return;
    }

    setIsOfferSending(true);
    try {
      const response = await sendNegotiatedOffer(selectedConversation.id, amount, 'Paiement uniquement via Camazones.');
      upsertConversation(mapConversation(response, currentEmail));
      setOfferAmount('');
    } catch (error) {
      Alert.alert('Offre non envoyée', error.response?.data?.message ?? 'Le vendeur doit être connecté.');
    } finally {
      setIsOfferSending(false);
    }
  };

  const payOffer = () => {
    if (!offer || !selectedConversation) {
      return;
    }

    navigation.navigate('Wallet', {
      productTitle: selectedConversation.product,
      productPrice: offer.amount,
      negotiatedPrice: offer.amount,
      sellerName: selectedConversation.sellerName,
      conversationId: selectedConversation.id,
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AnimatedBackdrop colors={colors} darkMode={darkMode} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>{t('sellerDm')}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{t('chatTitle')}</Text>
          <Text style={[styles.subtitle, { color: muted }]}>{isSyncing ? 'Synchronisation des conversations...' : t('chatSubtitle')}</Text>
        </View>

        <SectionHeader title={t('conversations')} description={t('conversationAccess')} />
        {conversationList.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.conversationRow}>
            {conversationList.map((conversation) => (
              <Pressable
                key={conversation.id}
                onPress={() => setSelectedId(conversation.id)}
                style={[
                  styles.conversationCard,
                  { backgroundColor: surface, borderColor: line },
                  selectedId === conversation.id && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                <View style={styles.conversationTop}>
                  <Text style={[styles.messageIcon, { color: colors.green ?? palette.green }, selectedId === conversation.id && { color: colors.background }]}>
                    💬
                  </Text>
                  {conversation.unread ? <Text style={styles.unread}>{conversation.unread}</Text> : null}
                </View>
                <Text style={[styles.conversationName, { color: colors.text }, selectedId === conversation.id && { color: colors.background }]}>
                  {conversation.sellerName}
                </Text>
                <Text style={[styles.conversationProduct, { color: muted }, selectedId === conversation.id && { color: colors.background }]}>
                  {conversation.product}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <Surface style={[styles.emptyCard, { backgroundColor: surface, borderColor: line }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucune conversation</Text>
            <Text style={[styles.emptyText, { color: muted }]}>Ouvre une boutique ou un produit puis appuie sur DM.</Text>
          </Surface>
        )}

        {selectedConversation ? (
          <Surface style={[styles.chatPanel, { backgroundColor: surface, borderColor: line }]} elevation={0}>
            <View style={styles.chatHeader}>
              <View>
                <Text style={[styles.chatTitle, { color: colors.text }]}>{selectedConversation.sellerName}</Text>
                <Text style={[styles.chatMeta, { color: muted }]}>{selectedConversation.product}</Text>
              </View>
              <Badge type={selectedConversation.status === 'Premium' ? 'premium' : 'ap'} />
            </View>

            <View style={styles.messages}>
              {messages.map((message) => {
                const isBuyer = message.from === 'buyer';
                return (
                  <View
                    key={message.id}
                    style={[
                      styles.messageBubble,
                      { backgroundColor: darkMode ? palette.dark : overlay.soft },
                      !isBuyer && styles.messageBubbleSeller,
                      isBuyer && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={[styles.messageText, { color: colors.text }, isBuyer && { color: colors.background }]}>{message.text}</Text>
                  </View>
                );
              })}
            </View>

            {offer ? (
              <Surface style={[styles.offerCard, { backgroundColor: darkMode ? palette.darkSurface : overlay.soft, borderColor: colors.primary }]} elevation={0}>
                <View style={styles.offerTop}>
                  <Text style={styles.offerIcon}>🤝</Text>
                  <View style={styles.offerCopy}>
                    <Text style={[styles.offerTitle, { color: colors.text }]}>Offre vendeur sécurisée</Text>
                    <Text style={[styles.offerText, { color: muted }]}>
                      {selectedConversation.sellerName} a envoyé une offre à {money(offer.amount)}. Le backend impose ce prix au paiement.
                    </Text>
                  </View>
                </View>
                <Button mode="contained" onPress={payOffer} buttonColor={colors.primary} textColor={colors.background}>
                  Payer l’offre
                </Button>
              </Surface>
            ) : null}

            {canSendOffer ? (
              <Surface style={[styles.offerForm, { backgroundColor: darkMode ? palette.dark : overlay.soft, borderColor: line }]} elevation={0}>
                <Text style={[styles.offerTitle, { color: colors.text }]}>Créer une offre de paiement</Text>
                <View style={styles.offerFormRow}>
                  <TextInput
                    value={offerAmount}
                    onChangeText={(value) => setOfferAmount(value.replace(/[^0-9]/g, ''))}
                    placeholder="Ex: 350000"
                    keyboardType="number-pad"
                    style={styles.offerInput}
                  />
                  <Button mode="contained" onPress={sendOffer} loading={isOfferSending} buttonColor={colors.secondary ?? palette.secondary} textColor={colors.background}>
                    Envoyer
                  </Button>
                </View>
              </Surface>
            ) : null}

            <View style={styles.composer}>
              <TextInput value={draft} onChangeText={setDraft} placeholder={t('writeMessage')} style={styles.input} />
              <Button mode="contained" onPress={sendMessage} loading={isSending} buttonColor={colors.secondary ?? palette.secondary} textColor={colors.background}>
                {t('send')}
              </Button>
            </View>
          </Surface>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    padding: 20,
    paddingBottom: 112,
    gap: 18,
  },
  header: {
    gap: 9,
  },
  eyebrow: {
    color: palette.secondary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.text,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    letterSpacing: -0.9,
  },
  subtitle: {
    color: overlay.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  conversationRow: {
    gap: 10,
    paddingRight: 20,
  },
  conversationCard: {
    width: 168,
    gap: 8,
    padding: 13,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: overlay.line,
    backgroundColor: overlay.surface,
  },
  emptyCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  emptyText: {
    lineHeight: 20,
    fontWeight: '700',
  },
  conversationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unread: {
    minWidth: 22,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
    color: palette.background,
    backgroundColor: palette.orange,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '900',
  },
  messageIcon: {
    fontSize: 16,
    fontWeight: '900',
  },
  conversationName: {
    color: palette.text,
    fontWeight: '900',
  },
  conversationProduct: {
    color: overlay.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  chatPanel: {
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: overlay.line,
    backgroundColor: overlay.surface,
    gap: 14,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  chatTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '900',
  },
  chatMeta: {
    color: overlay.muted,
    marginTop: 2,
    fontWeight: '700',
  },
  messages: {
    gap: 9,
  },
  messageBubble: {
    alignSelf: 'flex-start',
    maxWidth: '84%',
    padding: 11,
    borderRadius: 16,
    backgroundColor: overlay.soft,
  },
  messageBubbleSeller: {
    alignSelf: 'flex-end',
  },
  messageText: {
    color: palette.text,
    lineHeight: 19,
  },
  composer: {
    gap: 10,
  },
  input: {
    backgroundColor: palette.surface,
  },
  offerCard: {
    gap: 12,
    padding: 13,
    borderRadius: 18,
    borderWidth: 1,
  },
  offerForm: {
    gap: 10,
    padding: 13,
    borderRadius: 18,
    borderWidth: 1,
  },
  offerFormRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  offerInput: {
    flex: 1,
  },
  offerTop: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  offerIcon: {
    fontSize: 22,
  },
  offerCopy: {
    flex: 1,
    gap: 2,
  },
  offerTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  offerText: {
    lineHeight: 19,
    fontWeight: '700',
  },
});
