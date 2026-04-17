package com.organice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.organice.model.Producto;

@Entity
@Table(name = "banners")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "imagen_path", length = 500)
    private String imagenPath;

    // Orden en que aparece en el carrusel
    @Column(name = "orden")
    private Integer orden = 0;

    // Para activar o desactivar un banner sin borrarlo
    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // ── ──
     //
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "banner_productos",
        joinColumns = @JoinColumn(name = "banner_id"),
        inverseJoinColumns = @JoinColumn(name = "producto_id")
    )
    private List<Producto> productos = new ArrayList<>();
}
