package com.paf_grp.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// 1) Bring in your CustomUserDetailsService
@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    // Constructor injection for CustomUserDetailsService
    public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }

    // 2) Define a PasswordEncoder Bean
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 3) DaoAuthenticationProvider using CustomUserDetailsService
    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // 4) SecurityFilterChain using lambda-style configuration
    @Bean

    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Register our custom DaoAuthenticationProvider
        http.authenticationProvider(authProvider());

        http
                // CSRF disabled for development; handle properly in production
                .csrf(csrf -> csrf.disable())
                // Authorization rules in lambda style
                .authorizeHttpRequests(auth -> {
                    // Permit these endpoints without authentication
                    auth.requestMatchers(
                            "/api/users",
                            "/api/users/update/**",
                            "/api/users/**",
                            "/details/**",
                            "/api/auth/**",
                            "/api/notifications/**",
                            "/login"  // if you have a custom login page
                    ).permitAll();

                    // Require authentication for /api/posts/**
                    auth.requestMatchers("/api/posts/**").authenticated();

                    // All other endpoints also require authentication
                    auth.anyRequest().authenticated();
                })
                // Form login in lambda style
                .formLogin(form -> form
                        .loginPage("/login") // if you have a custom HTML login page
                        .permitAll()
                )
                // Logout in lambda style
                .logout(logout -> logout.permitAll())
                // Enable CORS with default settings (or customize if needed)
                .cors(Customizer.withDefaults());


        return http.build();
    }

}
