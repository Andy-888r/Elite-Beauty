package com.organice.repository;

import com.organice.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// =============================================
// AdministradorRepository.java
// =============================================
public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {
    Optional<Administrador> findByUsuarioAndActivoTrue(String usuario);
    boolean existsByUsuario(String usuario);
}
