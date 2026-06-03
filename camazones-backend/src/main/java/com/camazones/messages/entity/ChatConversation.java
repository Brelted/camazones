package com.camazones.messages.entity;

import com.camazones.auth.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "chat_conversations")
public class ChatConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_one_id", nullable = false)
    private User participantOne;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_two_id", nullable = false)
    private User participantTwo;

    @Column(nullable = false)
    private String productTitle;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(precision = 15, scale = 2)
    private BigDecimal negotiatedPrice;

    @Column(length = 40)
    private String negotiatedOfferStatus;

    @Column(length = 255)
    private String negotiatedByEmail;

    private LocalDateTime negotiatedAt;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> messages = new ArrayList<>();

    @PrePersist
    @PreUpdate
    void touch() {
        updatedAt = LocalDateTime.now();
        if (status == null || status.isBlank()) {
            status = "Active";
        }
        if (productTitle == null || productTitle.isBlank()) {
            productTitle = "Discussion Camazones";
        }
    }

    public UUID getId() {
        return id;
    }

    public User getParticipantOne() {
        return participantOne;
    }

    public void setParticipantOne(User participantOne) {
        this.participantOne = participantOne;
    }

    public User getParticipantTwo() {
        return participantTwo;
    }

    public void setParticipantTwo(User participantTwo) {
        this.participantTwo = participantTwo;
    }

    public String getProductTitle() {
        return productTitle;
    }

    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public BigDecimal getNegotiatedPrice() {
        return negotiatedPrice;
    }

    public void setNegotiatedPrice(BigDecimal negotiatedPrice) {
        this.negotiatedPrice = negotiatedPrice;
    }

    public String getNegotiatedOfferStatus() {
        return negotiatedOfferStatus;
    }

    public void setNegotiatedOfferStatus(String negotiatedOfferStatus) {
        this.negotiatedOfferStatus = negotiatedOfferStatus;
    }

    public String getNegotiatedByEmail() {
        return negotiatedByEmail;
    }

    public void setNegotiatedByEmail(String negotiatedByEmail) {
        this.negotiatedByEmail = negotiatedByEmail;
    }

    public LocalDateTime getNegotiatedAt() {
        return negotiatedAt;
    }

    public void setNegotiatedAt(LocalDateTime negotiatedAt) {
        this.negotiatedAt = negotiatedAt;
    }

    public List<ChatMessage> getMessages() {
        return messages;
    }

    public void addMessage(ChatMessage message) {
        messages.add(message);
        message.setConversation(this);
        updatedAt = LocalDateTime.now();
    }
}
