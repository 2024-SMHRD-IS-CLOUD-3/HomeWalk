package com.example.homewalk.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
        		.allowedOrigins(
        					"http://localhost:3005",   // 로컬 개발 주소
                			"http://192.168.219.55:3005" // 네트워크 내 다른 IP 주소
        				)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}