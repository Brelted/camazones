package com.camazones.auth.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * Entité User — tous les utilisateurs de Camazones.
 * Implémente UserDetails pour s'intégrer avec Spring Security.
 */
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "phone_number", unique = true, length = 20)
    private String phoneNumber;

    @Column(name = "profile_picture_url", length = 500)
    private String profilePictureUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role = UserRole.BUYER;

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;

    @Column(name = "verification_date")
    private LocalDateTime verificationDate;

    @Column(length = 100)
    private String city;

    @Column(columnDefinition = "TEXT")
    private String address;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "removed_at")
    private LocalDateTime removedAt;

    // ── Constructeurs ─────────────────────────────────────────────────────

    public User() {}

    // ── UserDetails (Spring Security) ────────────────────────────────────

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override public String getPassword()   { return passwordHash; }
    @Override public String getUsername()   { return email; }
    @Override public boolean isAccountNonExpired()   { return true; }
    @Override public boolean isAccountNonLocked()    { return deletedAt == null && removedAt == null; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled()             { return deletedAt == null && removedAt == null; }

    // ── Getters & Setters ─────────────────────────────────────────────────

    public UUID          getId()                 { return id; }
    public String        getEmail()              { return email; }
    public void          setEmail(String v)      { this.email = v; }
    public String        getPasswordHash()       { return passwordHash; }
    public void          setPasswordHash(String v){ this.passwordHash = v; }
    public String        getFirstName()          { return firstName; }
    public void          setFirstName(String v)  { this.firstName = v; }
    public String        getLastName()           { return lastName; }
    public void          setLastName(String v)   { this.lastName = v; }
    public String        getPhoneNumber()        { return phoneNumber; }
    public void          setPhoneNumber(String v){ this.phoneNumber = v; }
    public String        getProfilePictureUrl()  { return profilePictureUrl; }
    public void          setProfilePictureUrl(String v) { this.profilePictureUrl = v; }
    public String        getBio()                { return bio; }
    public void          setBio(String v)        { this.bio = v; }
    public UserRole      getRole()               { return role; }
    public void          setRole(UserRole v)     { this.role = v; }
    public boolean       isVerified()            { return isVerified; }
    public void          setVerified(boolean v)  { this.isVerified = v; }
    public LocalDateTime getVerificationDate()   { return verificationDate; }
    public void          setVerificationDate(LocalDateTime v) { this.verificationDate = v; }
    public String        getCity()               { return city; }
    public void          setCity(String v)       { this.city = v; }
    public String        getAddress()            { return address; }
    public void          setAddress(String v)    { this.address = v; }
    public LocalDateTime getCreatedAt()          { return createdAt; }
    public LocalDateTime getUpdatedAt()          { return updatedAt; }
    public LocalDateTime getDeletedAt()          { return deletedAt; }
    public void          setDeletedAt(LocalDateTime v) { this.deletedAt = v; }
    public LocalDateTime getRemovedAt()          { return removedAt; }
    public void          setRemovedAt(LocalDateTime v) { this.removedAt = v; }

    // ── Builder statique (remplace @Builder de Lombok) ────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final User u = new User();
        public Builder email(String v)        { u.email = v;        return this; }
        public Builder passwordHash(String v) { u.passwordHash = v; return this; }
        public Builder firstName(String v)    { u.firstName = v;    return this; }
        public Builder lastName(String v)     { u.lastName = v;     return this; }
        public Builder phoneNumber(String v)  { u.phoneNumber = v;  return this; }
        public Builder role(UserRole v)       { u.role = v;         return this; }
        public User build()                   { return u; }
    }
}
