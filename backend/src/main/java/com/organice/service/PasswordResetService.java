package com.organice.service;

import com.organice.model.Cliente;
import com.organice.model.PasswordResetToken;
import com.organice.repository.ClienteRepository;
import com.organice.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class PasswordResetService {

    @Autowired private ClienteRepository       clienteRepo;
    @Autowired private PasswordResetTokenRepository tokenRepo;
    @Autowired private JavaMailSender          mailSender;

    @Value("${spring.mail.username}")
    private String correoRemitente;

    // ══════════════════════════════════════
    // PASO 1 — Solicitar código
    // ══════════════════════════════════════
    @Transactional
    public void solicitarReset(String correo) {

        Cliente cliente = clienteRepo.findByCorreo(correo)
            .orElseThrow(() -> new RuntimeException(
                "No existe una cuenta registrada con ese correo"));

        // Eliminar tokens anteriores del mismo correo
        tokenRepo.deleteByCorreo(correo);

        // Generar código de 6 dígitos
        String codigo = String.format("%06d", new Random().nextInt(999999));

        // Guardar token con expiración de 15 minutos
        PasswordResetToken token = new PasswordResetToken();
        token.setCorreo(correo);
        token.setCodigo(codigo);
        token.setExpiracion(LocalDateTime.now().plusMinutes(15));
        tokenRepo.save(token);

        // Enviar correo
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(correoRemitente);
        mensaje.setTo(correo);
        mensaje.setSubject("Elite Beauty — Codigo para restablecer contrasena");
        mensaje.setText(
            "Hola " + cliente.getNombreCompleto() + ",\n\n" +
            "Recibimos una solicitud para restablecer la contrasena de tu cuenta.\n\n" +
            "Tu codigo de verificacion es:\n\n" +
            "        " + codigo + "\n\n" +
            "Este codigo expira en 15 minutos.\n\n" +
            "Si no solicitaste esto, puedes ignorar este mensaje " +
            "y tu contrasena seguira siendo la misma.\n\n" +
            "— Elite Beauty"
        );
        mailSender.send(mensaje);
    }

    // ══════════════════════════════════════
    // PASO 2 — Verificar código
    // ══════════════════════════════════════
    public void verificarCodigo(String correo, String codigo) {
        PasswordResetToken token = tokenRepo
            .findByCorreoAndCodigoAndUsadoFalse(correo, codigo)
            .orElseThrow(() -> new RuntimeException("Codigo invalido o ya utilizado"));

        if (token.getExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El codigo ha expirado, solicita uno nuevo");
        }
    }

    // ══════════════════════════════════════
    // PASO 3 — Cambiar contraseña
    // ══════════════════════════════════════
    @Transactional
    public void cambiarContrasena(String correo, String codigo, String nuevaContrasena) {
        PasswordResetToken token = tokenRepo
            .findByCorreoAndCodigoAndUsadoFalse(correo, codigo)
            .orElseThrow(() -> new RuntimeException("Codigo invalido o ya utilizado"));

        if (token.getExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El codigo ha expirado, solicita uno nuevo");
        }

        // Actualizar contraseña encriptada
        Cliente cliente = clienteRepo.findByCorreo(correo)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        cliente.setContrasena(new BCryptPasswordEncoder().encode(nuevaContrasena));
        clienteRepo.save(cliente);

        // Marcar token como usado
        token.setUsado(true);
        tokenRepo.save(token);
    }
}