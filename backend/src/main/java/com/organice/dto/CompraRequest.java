package com.organice.dto;
import lombok.Data;
import java.util.List;
@Data
public class CompraRequest {
    private Integer idCliente;
    private List<ItemCompra> items;
    @Data
    public static class ItemCompra {
        private Integer idProducto;
        private Integer cantidad;
        private Double precio;
    }
}
