package com.camazones.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Binding des propriétés JWT depuis application.properties.
 *
 * En production, définir la variable d'environnement JWT_SECRET
 * plutôt que de mettre la clé en clair dans le fichier de config.
 *
 * Exemple : JWT_SECRET=ma-cle-ultra-secrete-256-bits
 */
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * Clé secrète utilisée pour signer les tokens JWT.
     * Valeur par défaut uniquement pour le développement local.
     */
    private String secret;

    /**
     * Durée de vie du token JWT en millisecondes.
     * Par défaut : 86400000 ms = 24 heures
     */
    private long expiration = 86400000L;

    // ── Getters & Setters ─────────────────────────────────────────

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpiration() {
        return expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }
}
