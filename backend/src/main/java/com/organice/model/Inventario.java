package com.organice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

// =============================================
// INVENTARIO
// =============================================
// Archivo: Inventario.java
@Entity
@Table(name = "inventario")
@Data
@NoArgsConstructor
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "id_producto", unique = true, nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(nullable = false)
    private Integer minimo = 5;

    @Column(nullable = false)
    private String estado = "SIN STOCK";
}
