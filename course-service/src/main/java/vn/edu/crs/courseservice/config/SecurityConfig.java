package vn.edu.crs.courseservice.config;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import vn.edu.crs.courseservice.security.JwtAuthFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // API nội bộ cho registration-service
                        .requestMatchers("/internal/**")
                        .permitAll()

                        // GET course public
                        .requestMatchers(
                                HttpMethod.GET,
                                "/courses",
                                "/courses/**"
                        )
                        .permitAll()

                        // Chỉ ADMIN được tạo course
                        .requestMatchers(
                                HttpMethod.POST,
                                "/courses",
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        // Chỉ ADMIN được update
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/courses",
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        // Chỉ ADMIN được delete
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/courses",
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}