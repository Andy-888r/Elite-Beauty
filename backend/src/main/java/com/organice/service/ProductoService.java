package com.organice.service;

import com.organice.dto.ProductoConStockDTO;
import com.organice.model.Inventario;
import com.organice.model.Producto;
import com.organice.repository.InventarioRepository;
import com.organice.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
 
@Service
public class ProductoService {
 
    @Autowired private ProductoRepository productoRepo;
    @Autowired private InventarioRepository inventarioRepo;
    @Autowired private LocalStorageService storageService;
 
    public List<String> obtenerAlertasBajoStock() {
        return inventarioRepo.findAll()
            .stream()
            .filter(i -> "BAJO".equals(i.getEstado()) || "SIN STOCK".equals(i.getEstado()))
            .map(i -> "[" + i.getEstado() + "] " + i.getProducto().getNombre()
                    + " - Stock: " + i.getStock())
            .collect(Collectors.toList());
    }
 
    // ← NUEVO: lista activos incluyendo stock de inventario
    public List<ProductoConStockDTO> listarActivosConStock() {
        return productoRepo.findByActivoTrue()
            .stream()
            .map(p -> {
                Optional<Inventario> inv = inventarioRepo.findByProductoId(p.getId());
                int stock     = inv.map(Inventario::getStock).orElse(0);
                String estado = inv.map(Inventario::getEstado).orElse("SIN STOCK");
                return ProductoConStockDTO.from(p, stock, estado);
            })
            .collect(Collectors.toList());
    }
 
    public List<Producto> listarActivos() {
        return productoRepo.findByActivoTrue();
    }
 
    public List<Producto> listarTodos() {
        return productoRepo.findAll();
    }
 
    public Producto buscarPorId(Integer id) {
        return productoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + id));
    }
 
    public Producto crearProducto(Producto producto, MultipartFile imagen) throws IOException {
        if (imagen != null && !imagen.isEmpty()) {
            String url = storageService.guardarImagen(imagen);
            producto.setImagenPath(url);
        }
        producto.setActivo(false);
        Producto saved = productoRepo.save(producto);
 
        Inventario inv = new Inventario();
        inv.setProducto(saved);
        inv.setStock(0);
        inv.setMinimo(5);
        inv.setEstado("SIN STOCK");
        inventarioRepo.save(inv);
 
        return saved;
    }
 
    public Producto actualizarProducto(Integer id, Producto datos, MultipartFile imagen) throws IOException {
        Producto p = buscarPorId(id);
        p.setNombre(datos.getNombre());
        p.setMarca(datos.getMarca());
        p.setCategoria(datos.getCategoria());
        p.setDescripcion(datos.getDescripcion());
        p.setPrecio(datos.getPrecio());
        p.setActivo(datos.getActivo());
 
        if (imagen != null && !imagen.isEmpty()) {
            if (p.getImagenPath() != null) storageService.eliminarImagen(p.getImagenPath());
            p.setImagenPath(storageService.guardarImagen(imagen));
        }
 
        return productoRepo.save(p);
    }
 
    public void eliminarProducto(Integer id) {
        Producto p = buscarPorId(id);
        if (p.getImagenPath() != null) storageService.eliminarImagen(p.getImagenPath());
        productoRepo.deleteById(id);
    }
}