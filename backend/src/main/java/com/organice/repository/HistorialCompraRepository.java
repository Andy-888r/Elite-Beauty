package com.organice.repository;

import com.organice.model.HistorialCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface HistorialCompraRepository extends JpaRepository<HistorialCompra, Integer> {

    List<HistorialCompra> findByClienteIdOrderByFechaDesc(Integer clienteId);

    // Top productos más vendidos
    @Query("SELECT h.producto.nombre, SUM(h.cantidad), SUM(h.total) " +
           "FROM HistorialCompra h " +
           "GROUP BY h.producto.nombre " +
           "ORDER BY SUM(h.cantidad) DESC")
    List<Object[]> topProductosVendidos();

    // Ventas por día — últimos 30 días
    @Query("SELECT FUNCTION('DATE', h.fecha), SUM(h.total), SUM(h.cantidad) " +
           "FROM HistorialCompra h " +
           "WHERE h.fecha >= :desde " +
           "GROUP BY FUNCTION('DATE', h.fecha) " +
           "ORDER BY FUNCTION('DATE', h.fecha) ASC")
    List<Object[]> ventasPorDia(@Param("desde") LocalDateTime desde);

    // Ventas por categoría
    @Query("SELECT h.producto.categoria, SUM(h.cantidad), SUM(h.total) " +
           "FROM HistorialCompra h " +
           "GROUP BY h.producto.categoria " +
           "ORDER BY SUM(h.total) DESC")
    List<Object[]> ventasPorCategoria();

    // Totales generales — maneja NULLs en cliente
    @Query(value = "SELECT " +
           "COUNT(DISTINCT id_cliente) AS clientes, " +
           "COALESCE(SUM(total), 0) AS ingresos, " +
           "COALESCE(SUM(cantidad), 0) AS unidades " +
           "FROM historial_compras",
           nativeQuery = true)
    List<Object[]> totalesGenerales();
}