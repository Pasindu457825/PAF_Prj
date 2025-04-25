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
        http.authenticationProvider(authProvider());

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(
                            "/api/users/**",
                            "/api/auth/**",
                            "/api/groups/**",     // ✅ Add if public
                            "/login"              // Or remove this if unused
                    ).permitAll();

                    auth.anyRequest().authenticated();
                })
                .formLogin(form -> form.disable())  // ✅ DISABLE form login for API
                .httpBasic(Customizer.withDefaults()) // ✅ Optional for testing
                .logout(logout -> logout.permitAll())
                .cors(Customizer.withDefaults());

        return http.build();
    }


}
