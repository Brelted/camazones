import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, TextInput } from '../../components/ui';
import { Badge, SectionHeader } from '../../components/MarketplaceCards';
import { conversations } from '../../data/marketplace';
import { darkPalette, overlay, palette } from '../../theme';

export default function MessagesScreen({ route, appSettings }) {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id);
  const [draft, setDraft] = useState('');
  const [threadMessages, setThreadMessages] = useState(() =>
    conversations.reduce((accumulator, conversation) => {
      accumulator[conversation.id] = conversation.messages;
      return accumulator;
    }, {})
  );

  useEffect(() => {
    const sellerName = route?.params?.sellerName;
    const targetConversation = conversations.find((conversation) => conversation.sellerName === sellerName);

    if (targetConversation) {
      setSelectedId(targetConversation.id);
    }
  }, [route?.params?.sellerName]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0],
    [selectedId]
  );

  const messages = threadMessages[selectedConversation?.id] ?? [];
  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const surface = darkMode ? darkPalette.surface : overlay.surface;
  const t = appSettings?.t ?? ((key) => key);

  const sendMessage = () => {
    const cleanDraft = draft.trim();

    if (!cleanDraft || !selectedConversation) {
      return;
    }

    setThreadMessages((current) => ({
      ...current,
      [selectedConversation.id]: [
        ...(current[selectedConversation.id] ?? []),
        { id: `${selectedConversation.id}-${Date.now()}`, from: 'buyer', text: cleanDraft },
      ],
    }));
    setDraft('');
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>{t('sellerDm')}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{t('chatTitle')}</Text>
          <Text style={[styles.subtitle, { color: muted }]}>{t('chatSubtitle')}</Text>
        </View>

        <SectionHeader title={t('conversations')} description={t('conversationAccess')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.conversationRow}>
          {conversations.map((conversation) => (
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
                <Text style={[styles.messageIcon, { color: colors.green ?? palette.green }, selectedId === conversation.id && { color: colors.background }]}>DM</Text>
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
                  <View key={message.id} style={[styles.messageBubble, { backgroundColor: darkMode ? palette.dark : overlay.soft }, isBuyer && { backgroundColor: colors.primary }]}>
                    <Text style={[styles.messageText, { color: colors.text }, isBuyer && { color: colors.background }]}>{message.text}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.composer}>
              <TextInput value={draft} onChangeText={setDraft} placeholder={t('writeMessage')} style={styles.input} />
              <Button mode="contained" onPress={sendMessage} buttonColor={colors.green ?? palette.green} textColor={colors.background}>
                {t('send')}
              </Button>
            </View>
          </Surface>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
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
  conversationCardActive: {
    borderColor: palette.primary,
    backgroundColor: palette.primary,
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
    color: palette.green,
    fontSize: 12,
    fontWeight: '900',
  },
  messageIconActive: {
    color: palette.background,
  },
  conversationName: {
    color: palette.text,
    fontWeight: '900',
  },
  conversationNameActive: {
    color: palette.background,
  },
  conversationProduct: {
    color: overlay.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  conversationProductActive: {
    color: palette.background,
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
  messageBubbleBuyer: {
    alignSelf: 'flex-end',
    backgroundColor: palette.primary,
  },
  messageText: {
    color: palette.text,
    lineHeight: 19,
  },
  messageTextBuyer: {
    color: palette.background,
  },
  composer: {
    gap: 10,
  },
  input: {
    backgroundColor: palette.surface,
  },
});
