import apiClient from './apiClient';

const displayProduct = (value) => value?.trim?.() || 'Discussion Camazones';

export const mapConversation = (conversation, currentEmail) => ({
  id: String(conversation.id),
  remote: true,
  sellerName: conversation.recipientName,
  sellerEmail: conversation.recipientEmail,
  product: displayProduct(conversation.productTitle),
  unread: conversation.unread ?? 0,
  status: conversation.status ?? 'Active',
  negotiatedOffer: conversation.negotiatedPrice
    ? {
        amount: Number(conversation.negotiatedPrice),
        status: conversation.negotiatedOfferStatus,
        byEmail: conversation.negotiatedByEmail,
      }
    : null,
  messages: (conversation.messages ?? []).map((message) => ({
    id: String(message.id),
    from: message.senderEmail?.toLowerCase?.() === currentEmail?.toLowerCase?.() || message.from === 'me' ? 'buyer' : 'seller',
    text: message.text,
    senderName: message.senderName,
    createdAt: message.createdAt,
  })),
});

export const fetchConversations = async () => apiClient.get('/messages/conversations');

export const startConversation = async ({ sellerEmail, productTitle, openingMessage }) =>
  apiClient.post('/messages/conversations', {
    recipientEmail: sellerEmail,
    productTitle: displayProduct(productTitle),
    openingMessage,
  });

export const sendConversationMessage = async (conversationId, text) =>
  apiClient.post(`/messages/conversations/${conversationId}/messages`, { text });

export const sendNegotiatedOffer = async (conversationId, amount, note) =>
  apiClient.post(`/messages/conversations/${conversationId}/offer`, { amount, note });
