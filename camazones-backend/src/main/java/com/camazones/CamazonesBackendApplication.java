package com.camazones;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import com.camazones.auth.config.JwtProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class CamazonesBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(CamazonesBackendApplication.class, args);
    }
}
