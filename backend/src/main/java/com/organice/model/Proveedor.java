package com.organice.model;
 
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
 
@Entity
@Table(name = "proveedores")
@Data
@NoArgsConstructor
public class Proveedor {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
 
    @Column(nullable = false)
    private String nombre;
 
    private String empresa;
    private String url;        // ← aqui se pone el: sitio web del proveedor
    private String logoPath;
 
    private Boolean activo = true;
 
}