package com.organice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nombre;

    private String marca;
    private String categoria;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    // URL de Amazon S3
    @Column(name = "imagen_path", length = 500)
    private String imagenPath;

    @Column(nullable = false)
    private Double precio = 0.0;

    @Column(nullable = false)
    private Boolean activo = false;
}
