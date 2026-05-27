package com.camazones.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Binding des propriétés JWT depuis application.properties.
 * En production : définir JWT_SECRET comme variable d'environnement.
 */
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    private String secret;
    private long   expiration = 86400000L;  // 24h par défaut

    public String getSecret()               { return secret; }
    public void   setSecret(String secret)  { this.secret = secret; }
    public long   getExpiration()           { return expiration; }
    public void   setExpiration(long exp)   { this.expiration = exp; }
}
