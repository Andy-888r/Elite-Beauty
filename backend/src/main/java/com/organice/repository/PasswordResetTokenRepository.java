package com.organice.repository;

import com.organice.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {

    Optional<PasswordResetToken> findByCorreoAndCodigoAndUsadoFalse(String correo, String codigo);

    @Modifying
    @Transactional
    @Query("DELETE FROM PasswordResetToken t WHERE t.correo = :correo")
    void deleteByCorreo(String correo);
}