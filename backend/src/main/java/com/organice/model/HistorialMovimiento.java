package com.organice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_movimientos")
@Data
@NoArgsConstructor
public class HistorialMovimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private String tipo; // "Entrada" o "Salida"

    @Column(nullable = false)
    private Integer cantidad;

    private String motivo;

    private LocalDateTime fecha = LocalDateTime.now();
}
