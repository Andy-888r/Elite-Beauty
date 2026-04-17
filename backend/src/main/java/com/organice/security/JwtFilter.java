package com.organice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.isTokenValid(token)) {
                String usuario = jwtUtil.extractUsuario(token);
                String rol = jwtUtil.extractRol(token);
                if (jwtUtil.isTokenValid(token)) {
       usuario = jwtUtil.extractUsuario(token);
       rol = jwtUtil.extractRol(token);
    
    // ← LOGS TEMPORALES
    System.out.println("=== JWT DEBUG ===");
    System.out.println(">>> USUARIO: " + usuario);
    System.out.println(">>> ROL EXTRAÍDO: [" + rol + "]");
    System.out.println(">>> AUTHORITY: [ROLE_" + rol + "]");
    System.out.println("=================");

    UsernamePasswordAuthenticationToken auth =
        new UsernamePasswordAuthenticationToken(
            usuario, null,
            List.of(new SimpleGrantedAuthority("ROLE_" + rol))
        );
    SecurityContextHolder.getContext().setAuthentication(auth);
}

                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                        usuario, null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + rol))
                    );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        chain.doFilter(request, response);
    }
}
