package com.paf_grp.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()  // Deprecated, consider handling CSRF differently if using Spring Security 6+
            .authorizeHttpRequests()
                .requestMatchers(
                    "/api/users", 
                    "/api/users/update/**",
                    "/api/users/**", 
                    "/api/auth/**", 
                    "/login"
                ).permitAll()
                .anyRequest().authenticated()
            .and()
            .formLogin()
                .loginPage("/login")
                .permitAll()
            .and()
            .logout()
                .permitAll()
            .and()
            .cors();  // Enable CORS globally
        return http.build();
    }
}

