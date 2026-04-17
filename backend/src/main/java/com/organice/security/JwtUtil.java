package com.organice.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String usuario, String rol, Integer id) {
    // Normaliza el rol al estándar ADMIN/CLIENTE/PROVEEDOR
    String rolNormalizado = switch (rol) {
        case "Administrador" -> "ADMIN";
        case "Cliente" -> "CLIENTE";
        case "Proveedor" -> "PROVEEDOR";
        case "Empleado" -> "EMPLEADO";
        default -> rol.toUpperCase();
    };

    return Jwts.builder()
            .setSubject(usuario)
            .claim("rol", rolNormalizado)  // ← guarda el rol normalizado
            .claim("id", id)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getKey(), SignatureAlgorithm.HS256)
            .compact();
}

    public String extractUsuario(String token) {
        return getClaims(token).getSubject();
    }

    public String extractRol(String token) {
        return (String) getClaims(token).get("rol");
    }

    public Integer extractId(String token) {
        return (Integer) getClaims(token).get("id");
    }

    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
