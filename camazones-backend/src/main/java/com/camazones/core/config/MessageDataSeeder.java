package com.camazones.core.config;

import com.camazones.auth.entity.User;
import com.camazones.auth.repository.UserRepository;
import com.camazones.messages.entity.ChatConversation;
import com.camazones.messages.entity.ChatMessage;
import com.camazones.messages.repository.ChatConversationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(2)
public class MessageDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ChatConversationRepository conversationRepository;
    private final boolean seedEnabled;

    public MessageDataSeeder(UserRepository userRepository,
                             ChatConversationRepository conversationRepository,
                             @Value("${camazones.seed.enabled:true}") boolean seedEnabled) {
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.seedEnabled = seedEnabled;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled || conversationRepository.count() > 0) {
            return;
        }

        userRepository.findByEmailAndDeletedAtIsNullAndRemovedAtIsNull("alan.independant@camazones.demo")
                .flatMap(alan -> userRepository.findByEmailAndDeletedAtIsNullAndRemovedAtIsNull("sony@camazones.demo").map(sony -> new User[]{alan, sony}))
                .ifPresent(users -> seedAlanSony(users[0], users[1]));
    }

    private void seedAlanSony(User alan, User sony) {
        ChatConversation conversation = new ChatConversation();
        conversation.setParticipantOne(alan);
        conversation.setParticipantTwo(sony);
        conversation.setProductTitle("Sony Xperia Slim");
        conversation.setStatus("Negociation acceptee");
        add(conversation, alan, "Bonjour Sony, je suis Alan. Le Sony Xperia Slim est a 390 000 FCFA, possible de revoir le prix ?");
        add(conversation, sony, "Bonjour Alan, il est neuf avec garantie boutique. Vous proposez combien ?");
        add(conversation, alan, "Je peux payer 350 000 FCFA aujourd hui via Camazones Pay.");
        add(conversation, sony, "Accorde. Sony accepte 350 000 FCFA si paiement aujourd hui.");
        add(conversation, alan, "Parfait, je confirme le paiement maintenant.");
        conversationRepository.save(conversation);
    }

    private void add(ChatConversation conversation, User sender, String text) {
        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setText(text);
        conversation.addMessage(message);
    }
}
