package com.camazones.messages.repository;

import com.camazones.messages.entity.ChatConversation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatConversationRepository extends JpaRepository<ChatConversation, UUID> {

    @EntityGraph(attributePaths = {"participantOne", "participantTwo", "messages", "messages.sender"})
    @Query("""
            select distinct conversation
            from ChatConversation conversation
            where conversation.participantOne.email = :email
               or conversation.participantTwo.email = :email
            order by conversation.updatedAt desc
            """)
    List<ChatConversation> findAllForUser(@Param("email") String email);

    @EntityGraph(attributePaths = {"messages"})
    @Query("""
            select distinct conversation
            from ChatConversation conversation
            where conversation.participantOne.id = :userId
               or conversation.participantTwo.id = :userId
            """)
    List<ChatConversation> findAllForUserId(@Param("userId") UUID userId);

    @EntityGraph(attributePaths = {"participantOne", "participantTwo", "messages", "messages.sender"})
    @Query("""
            select conversation
            from ChatConversation conversation
            where ((conversation.participantOne.email = :leftEmail and conversation.participantTwo.email = :rightEmail)
                or (conversation.participantOne.email = :rightEmail and conversation.participantTwo.email = :leftEmail))
              and lower(conversation.productTitle) = lower(:productTitle)
            """)
    Optional<ChatConversation> findExisting(
            @Param("leftEmail") String leftEmail,
            @Param("rightEmail") String rightEmail,
            @Param("productTitle") String productTitle);
}
