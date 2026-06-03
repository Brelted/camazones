package com.camazones.messages.service;

import com.camazones.auth.entity.User;
import com.camazones.auth.repository.UserRepository;
import com.camazones.messages.dto.ConversationResponse;
import com.camazones.messages.dto.MessageResponse;
import com.camazones.messages.dto.SendMessageRequest;
import com.camazones.messages.dto.StartConversationRequest;
import com.camazones.messages.entity.ChatConversation;
import com.camazones.messages.entity.ChatMessage;
import com.camazones.messages.repository.ChatConversationRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class MessageService {

    private final UserRepository userRepository;
    private final ChatConversationRepository conversationRepository;

    public MessageService(UserRepository userRepository, ChatConversationRepository conversationRepository) {
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
    }

    @Transactional(readOnly = true)
    public List<ConversationResponse> getConversations(String email) {
        return conversationRepository.findAllForUser(email).stream()
                .map(conversation -> toResponse(conversation, email))
                .toList();
    }

    @Transactional
    public ConversationResponse startConversation(String email, StartConversationRequest request) {
        User currentUser = findUser(email);
        User recipient = findUser(request.recipientEmail());
        if (currentUser.getEmail().equalsIgnoreCase(recipient.getEmail())) {
            throw new IllegalArgumentException("Impossible de demarrer une conversation avec soi-meme.");
        }

        String productTitle = clean(request.productTitle(), "Discussion Camazones");
        ChatConversation conversation = conversationRepository
                .findExisting(currentUser.getEmail(), recipient.getEmail(), productTitle)
                .orElseGet(() -> {
                    ChatConversation created = new ChatConversation();
                    created.setParticipantOne(currentUser);
                    created.setParticipantTwo(recipient);
                    created.setProductTitle(productTitle);
                    created.setStatus("Active");
                    return created;
                });

        String openingMessage = clean(request.openingMessage(), null);
        if (conversation.getId() == null && openingMessage != null) {
            conversation.addMessage(createMessage(currentUser, openingMessage));
        }

        ChatConversation saved = conversationRepository.save(conversation);
        return toResponse(saved, email);
    }

    @Transactional
    public ConversationResponse sendMessage(String email, UUID conversationId, SendMessageRequest request) {
        User sender = findUser(email);
        ChatConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation introuvable."));

        if (!isParticipant(conversation, email)) {
            throw new AccessDeniedException("Conversation non autorisee.");
        }

        conversation.addMessage(createMessage(sender, clean(request.text(), "")));
        ChatConversation saved = conversationRepository.save(conversation);
        return toResponse(saved, email);
    }

    private ChatMessage createMessage(User sender, String text) {
        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setText(text);
        return message;
    }

    private ConversationResponse toResponse(ChatConversation conversation, String currentEmail) {
        User recipient = conversation.getParticipantOne().getEmail().equalsIgnoreCase(currentEmail)
                ? conversation.getParticipantTwo()
                : conversation.getParticipantOne();

        List<MessageResponse> messages = conversation.getMessages().stream()
                .sorted(Comparator.comparing(ChatMessage::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(message -> new MessageResponse(
                        message.getId(),
                        message.getSender().getEmail().equalsIgnoreCase(currentEmail) ? "me" : "other",
                        message.getSender().getEmail(),
                        displayName(message.getSender()),
                        message.getText(),
                        message.getCreatedAt()
                ))
                .toList();

        return new ConversationResponse(
                conversation.getId(),
                recipient.getEmail(),
                displayName(recipient),
                conversation.getProductTitle(),
                conversation.getStatus(),
                0,
                conversation.getUpdatedAt(),
                messages
        );
    }

    private User findUser(String email) {
        return userRepository.findByEmailAndDeletedAtIsNullAndRemovedAtIsNull(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable: " + email));
    }

    private boolean isParticipant(ChatConversation conversation, String email) {
        return conversation.getParticipantOne().getEmail().equalsIgnoreCase(email)
                || conversation.getParticipantTwo().getEmail().equalsIgnoreCase(email);
    }

    private String displayName(User user) {
        String name = ((user.getFirstName() == null ? "" : user.getFirstName()) + " " + (user.getLastName() == null ? "" : user.getLastName())).trim();
        return name.isBlank() ? user.getEmail() : name;
    }

    private String clean(String value, String fallback) {
        if (value == null || value.trim().isBlank()) {
            return fallback;
        }
        return value.trim();
    }
}
