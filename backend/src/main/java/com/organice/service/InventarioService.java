package com.organice.service;

import com.organice.model.HistorialMovimiento;
import com.organice.model.Inventario;
import com.organice.model.Producto;
import com.organice.repository.HistorialMovimientoRepository;
import com.organice.repository.InventarioRepository;
import com.organice.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventarioService {

    @Autowired private InventarioRepository inventarioRepo;
    @Autowired private HistorialMovimientoRepository movimientoRepo;
    @Autowired private ProductoRepository productoRepo;

    public List<Inventario> listarInventario() {
        return inventarioRepo.findAll();
    }

    public List<HistorialMovimiento> listarHistorial() {
        return movimientoRepo.findAllByOrderByFechaDesc();
    }

    @Transactional
    public boolean registrarMovimiento(Integer idProducto, boolean esEntrada,
                                        Integer cantidad, String motivo) {
        Producto prod = productoRepo.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Inventario inv = inventarioRepo.findByProductoId(idProducto)
                .orElseGet(() -> {
                    Inventario nuevo = new Inventario();
                    nuevo.setProducto(prod);
                    nuevo.setStock(0);
                    nuevo.setMinimo(5);
                    return nuevo;
                });

        int nuevoStock = esEntrada ? inv.getStock() + cantidad : inv.getStock() - cantidad;
        if (nuevoStock < 0) nuevoStock = 0;
        inv.setStock(nuevoStock);
        inv.setEstado(nuevoStock == 0 ? "SIN STOCK" : nuevoStock <= inv.getMinimo() ? "BAJO" : "OK");
        inventarioRepo.save(inv);

        HistorialMovimiento mov = new HistorialMovimiento();
        mov.setProducto(prod);
        mov.setTipo(esEntrada ? "Entrada" : "Salida");
        mov.setCantidad(cantidad);
        mov.setMotivo(motivo);
        mov.setFecha(LocalDateTime.now());
        movimientoRepo.save(mov);

        return true;
    }
}
