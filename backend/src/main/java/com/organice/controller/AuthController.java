package com.organice.controller;

import com.organice.dto.LoginRequest;
import com.organice.model.Cliente;
import com.organice.service.AuthService;
import com.organice.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private AuthService authService;
    @Autowired private PasswordResetService passwordResetService;

    // ── Login ──
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try { return ResponseEntity.ok(authService.login(req)); }
        catch (RuntimeException e) { return ResponseEntity.status(401).body(e.getMessage()); }
    }

    // ── Registro cliente ──
    @PostMapping("/registro/cliente")
    public ResponseEntity<?> registrarCliente(@RequestBody Cliente c) {
        try { return ResponseEntity.ok(authService.registrarCliente(c)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    // ── Olvide contrasena — Paso 1: enviar codigo ──
    @PostMapping("/olvide-contrasena")
    public ResponseEntity<?> olvidéContrasena(@RequestBody Map<String, String> body) {
        try {
            passwordResetService.solicitarReset(body.get("correo"));
            return ResponseEntity.ok("Codigo enviado al correo");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Olvide contrasena — Paso 2: verificar codigo ──
    @PostMapping("/verificar-codigo")
    public ResponseEntity<?> verificarCodigo(@RequestBody Map<String, String> body) {
        try {
            passwordResetService.verificarCodigo(
                body.get("correo"),
                body.get("codigo"));
            return ResponseEntity.ok("Codigo valido");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Olvide contrasena — Paso 3: nueva contrasena ──
    @PostMapping("/nueva-contrasena")
    public ResponseEntity<?> nuevaContrasena(@RequestBody Map<String, String> body) {
        try {
            passwordResetService.cambiarContrasena(
                body.get("correo"),
                body.get("codigo"),
                body.get("nuevaContrasena"));
            return ResponseEntity.ok("Contrasena actualizada correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}