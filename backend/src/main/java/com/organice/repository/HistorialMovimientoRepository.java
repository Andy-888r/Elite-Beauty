package com.organice.repository;

import com.organice.model.HistorialMovimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistorialMovimientoRepository extends JpaRepository<HistorialMovimiento, Integer> {
    List<HistorialMovimiento> findAllByOrderByFechaDesc();
}
