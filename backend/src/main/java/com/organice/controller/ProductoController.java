package com.organice.controller;
 
import com.organice.dto.ProductoConStockDTO;
import com.organice.model.Producto;
import com.organice.service.ProductoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
 
@RestController
@RequestMapping("/productos")
public class ProductoController {
    @Autowired private ProductoService productoService;
    @Autowired private ObjectMapper objectMapper;
 
    // ← ahora devuelve ProductoConStockDTO con el stock incluido
    @GetMapping("/activos")
    public List<ProductoConStockDTO> listarActivos() {
        return productoService.listarActivosConStock();
    }
 
    @GetMapping
    public List<Producto> listarTodos() { return productoService.listarTodos(); }
 
    @GetMapping("/{id}")
    public Producto buscarPorId(@PathVariable Integer id) { return productoService.buscarPorId(id); }
 
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crear(@RequestPart("producto") String json,
                                   @RequestPart(value = "imagen", required = false) MultipartFile img) {
        try {
            Producto p = objectMapper.readValue(json, Producto.class);
            return ResponseEntity.ok(productoService.crearProducto(p, img));
        } catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
 
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> actualizar(@PathVariable Integer id,
                                        @RequestPart("producto") String json,
                                        @RequestPart(value = "imagen", required = false) MultipartFile img) {
        try {
            Producto p = objectMapper.readValue(json, Producto.class);
            return ResponseEntity.ok(productoService.actualizarProducto(id, p, img));
        } catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.ok("Producto eliminado");
    }
}