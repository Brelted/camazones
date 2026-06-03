package com.camazones.auth.service;

import com.camazones.auth.dto.LoginRequest;
import com.camazones.auth.entity.User;
import com.camazones.auth.entity.UserRole;
import com.camazones.auth.repository.UserRepository;
import com.camazones.notifications.service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final JwtProvider jwtProvider = mock(JwtProvider.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final EmailService emailService = mock(EmailService.class);
    private final AccountDeletionService accountDeletionService = mock(AccountDeletionService.class);
    private final AuthService authService = new AuthService(userRepository, jwtProvider, passwordEncoder, emailService, accountDeletionService);

    @Test
    void loginRejectsRemovedUserBecauseRepositoryOnlyReturnsActiveUsers() {
        when(userRepository.findByEmailAndDeletedAtIsNullAndRemovedAtIsNull("deleted@camazones.test"))
                .thenReturn(Optional.empty());

        assertThrows(
                BadCredentialsException.class,
                () -> authService.login(new LoginRequest("deleted@camazones.test", "secret"))
        );

        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtProvider, never()).generateToken(anyString());
    }

    @Test
    void loadUserByUsernameRejectsDeletedUsers() {
        when(userRepository.findByEmailAndDeletedAtIsNullAndRemovedAtIsNull("blocked@camazones.test"))
                .thenReturn(Optional.empty());

        assertThrows(
                UsernameNotFoundException.class,
                () -> authService.loadUserByUsername("blocked@camazones.test")
        );
    }

    @Test
    void entityDisabledWhenDeletedOrRemoved() {
        User user = User.builder()
                .email("user@camazones.test")
                .passwordHash("hash")
                .firstName("User")
                .lastName("Test")
                .role(UserRole.BUYER)
                .build();

        user.setDeletedAt(LocalDateTime.now());
        assertFalse(user.isEnabled());
    }
}
