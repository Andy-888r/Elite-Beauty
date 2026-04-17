package com.organice.dto;

import java.util.List;
import java.util.ArrayList;

public class BannerDTO {
    private String titulo;
    private String descripcion;
    private Integer orden;
    private Boolean activo;
    private Integer idProducto;
    private List<Integer> productosIds = new ArrayList<>();

    // Getters y Setters
    public String getTitulo() 
    { 
        return titulo; 
    }
    public void setTitulo(String titulo)
     { 
        this.titulo = titulo; 
    }
    public String getDescripcion() 
    { 
        return descripcion;
     }
    public void setDescripcion(String descripcion)
     { 
        this.descripcion = descripcion; 
    }
    public Integer getOrden() 
    {
         return orden; 
        }
    public void setOrden(Integer orden) 
    { 
        this.orden = orden; 
    }
    public Boolean getActivo() 
    { 
        return activo; 
    }
    public void setActivo(Boolean activo) 
    { 
        this.activo = activo; 
    }
    public Integer getIdProducto() 
    { 
        return idProducto; 
    }
    public void setIdProducto(Integer idProducto) 
    { 
        this.idProducto = idProducto; 
    }
    public List<Integer> getProductosIds()
     {
         return productosIds; 
        }
    public void setProductosIds(List<Integer> productosIds)
     { 
        this.productosIds = productosIds; 
    }
}