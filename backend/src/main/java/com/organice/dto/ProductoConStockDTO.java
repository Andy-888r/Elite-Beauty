package com.organice.dto;
 
import com.organice.model.Producto;
import lombok.Data;
 
@Data
public class ProductoConStockDTO {
    private Integer id;
    private String  nombre;
    private String  marca;
    private String  categoria;
    private String  descripcion;
    private Double  precio;
    private String  imagenPath;
    private Boolean activo;
    private Integer stock;      // ← viene del inventario
    private String  estadoStock; // "OK", "BAJO", "SIN STOCK"
 
    public static ProductoConStockDTO from(Producto p, Integer stock, String estado) {
        ProductoConStockDTO dto = new ProductoConStockDTO();
        dto.setId(p.getId());
        dto.setNombre(p.getNombre());
        dto.setMarca(p.getMarca());
        dto.setCategoria(p.getCategoria());
        dto.setDescripcion(p.getDescripcion());
        dto.setPrecio(p.getPrecio());
        dto.setImagenPath(p.getImagenPath());
        dto.setActivo(p.getActivo());
        dto.setStock(stock != null ? stock : 0);
        dto.setEstadoStock(estado != null ? estado : "SIN STOCK");
        return dto;
    }
}