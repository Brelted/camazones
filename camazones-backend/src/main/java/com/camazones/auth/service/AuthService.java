package com.camazones.auth.service;

import com.camazones.auth.dto.*;
import com.camazones.auth.entity.User;
import com.camazones.auth.entity.UserRole;
import com.camazones.auth.repository.UserRepository;
import com.camazones.notifications.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Logique métier : register, login, profil utilisateur.
 */
@Service
public class AuthService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository  userRepository;
    private final JwtProvider     jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                       JwtProvider jwtProvider,
                       PasswordEncoder passwordEncoder,
                       EmailService emailService) {
        this.userRepository  = userRepository;
        this.jwtProvider     = jwtProvider;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // ── UserDetailsService ────────────────────────────────────────────────

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Aucun utilisateur avec l'email : " + email));
    }

    // ── Register ──────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email()))
            throw new IllegalArgumentException("Cet email est déjà utilisé.");

        if (req.phone() != null && !req.phone().isBlank()
                && userRepository.existsByPhoneNumber(req.phone()))
            throw new IllegalArgumentException("Ce numéro de téléphone est déjà utilisé.");

        User user = User.builder()
                .email(req.email())
                .passwordHash(passwordEncoder.encode(req.password()))
                .firstName(req.firstName())
                .lastName(req.lastName())
                .phoneNumber(req.phone())
                .role(UserRole.BUYER)
                .build();

        user = userRepository.save(user);
        log.info("Nouvel utilisateur : {} ({})", user.getEmail(), user.getId());
        emailService.sendWelcomeEmail(user);

        return buildResponse(jwtProvider.generateToken(user.getEmail()), user);
    }

    // ── Login ─────────────────────────────────────────────────────────────

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new BadCredentialsException("Email ou mot de passe incorrect."));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash()))
            throw new BadCredentialsException("Email ou mot de passe incorrect.");

        if (!user.isEnabled())
            throw new BadCredentialsException("Compte bloque.");

        log.info("Connexion : {}", user.getEmail());
        return buildResponse(jwtProvider.generateToken(user.getEmail()), user);
    }

    // ── Profil ────────────────────────────────────────────────────────────

    public UserProfileDto getProfile(String email) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable."));

        return toProfile(u);
    }

    @Transactional
    public UserProfileDto updateProfile(String email, UpdateProfileRequest req) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable."));

        if (req.firstName() != null) u.setFirstName(req.firstName());
        if (req.lastName() != null) u.setLastName(req.lastName());
        if (req.phone() != null && !req.phone().equals(u.getPhoneNumber())) {
            if (!req.phone().isBlank() && userRepository.existsByPhoneNumber(req.phone()))
                throw new IllegalArgumentException("Ce numéro de téléphone est déjà utilisé.");
            u.setPhoneNumber(req.phone());
        }
        if (req.profilePictureUrl() != null) u.setProfilePictureUrl(req.profilePictureUrl());
        if (req.bio() != null) u.setBio(req.bio());
        if (req.city() != null) u.setCity(req.city());
        if (req.address() != null) u.setAddress(req.address());

        return toProfile(userRepository.save(u));
    }

    private UserProfileDto toProfile(User u) {
        return new UserProfileDto(
                u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(),
                u.getPhoneNumber(), u.getProfilePictureUrl(), u.getBio(),
                u.getRole(), u.isVerified(), u.getCity(), u.getCreatedAt()
        );
    }

    // ── Utilitaire ────────────────────────────────────────────────────────

    private AuthResponse buildResponse(String token, User u) {
        return new AuthResponse(
                token,
                new AuthResponse.UserInfo(u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(), u.getPhoneNumber(), u.getRole())
        );
    }
}
