package com.organice.dto;
import lombok.Data;
@Data
public class ProductoDTO {
    private Integer id;
    private String nombre;
    private String marca;
    private String categoria;
    private String descripcion;
    private String imagenPath;
    private Double precio;
    private Boolean activo;
    private Integer stock;
}
