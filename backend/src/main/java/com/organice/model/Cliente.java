package com.organice.model;
 
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
 
@Entity
@Table(name = "clientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
 
    @Column(nullable = false, unique = true)
    private String usuario;
 
    @Column(nullable = false)
    private String contrasena;
 
    @Column(name = "nombre_completo")
    private String nombreCompleto;
 
    private String telefono;
    private String correo;
    private String direccion;
 
    private String fotoPerfil; // ← NUEVO: ruta de la foto de perfil
 
    @ElementCollection
    @CollectionTable(
        name = "cliente_preferencias",
        joinColumns = @JoinColumn(name = "cliente_id")
    )
    @Column(name = "preferencia")
    private List<String> preferencias;
}