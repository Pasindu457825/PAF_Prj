package com.paf_grp.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // ✅ Allow OPTIONS
                .allowedHeaders("*") // ✅ Allow any headers
                .allowCredentials(true); // Optional: if you’re using cookies/auth
    }
}
