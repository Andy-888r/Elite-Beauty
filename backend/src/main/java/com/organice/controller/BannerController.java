package com.organice.controller;

import com.organice.model.Banner;
import com.organice.model.Producto;
import com.organice.repository.BannerRepository;
import com.organice.service.LocalStorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

import com.organice.repository.ProductoRepository;
import java.util.ArrayList;

@RestController
@RequestMapping("/banners")

public class BannerController {
    
     @Autowired private BannerRepository bannerRepository;
    @Autowired private LocalStorageService storageService;
    @Autowired private ObjectMapper objectMapper;

    @Autowired private ProductoRepository productoRepository;

    // ── Público: solo los activos (para el cliente) ──
    @GetMapping("/activos")
    public List<Banner> listarActivos() {
        return bannerRepository.findByActivoTrueOrderByOrdenAsc();
    }

    // ── Admin: todos los banners ──
    @GetMapping
    public List<Banner> listarTodos() {
        return bannerRepository.findAll();
    }

    // ── Admin: crear banner con imagen ──
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crear(
            @RequestPart("banner") String json,
            @RequestPart(value = "imagen", required = false) MultipartFile img) {
        try {
            Banner banner = objectMapper.readValue(json, Banner.class);
            if (img != null && !img.isEmpty()) {
                banner.setImagenPath(storageService.guardarImagen(img));
            }
            return ResponseEntity.ok(bannerRepository.save(banner));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Admin: editar banner ──
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> actualizar(
            @PathVariable Integer id,
            @RequestPart("banner") String json,
            @RequestPart(value = "imagen", required = false) MultipartFile img) {
        try {
            Banner existente = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner no encontrado"));
            Banner datos = objectMapper.readValue(json, Banner.class);
            existente.setTitulo(datos.getTitulo());
            existente.setDescripcion(datos.getDescripcion());
            existente.setOrden(datos.getOrden());
            existente.setActivo(datos.getActivo());
            if (img != null && !img.isEmpty()) {
                existente.setImagenPath(storageService.guardarImagen(img));
            }
            return ResponseEntity.ok(bannerRepository.save(existente));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PutMapping("/{id}/productos")
public ResponseEntity<?> asociarProductos(
        @PathVariable Integer id,
        @RequestBody List<Integer> productoIds) {
    try {
        Banner banner = bannerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Banner no encontrado"));
        List<Producto> productos = productoIds == null || productoIds.isEmpty()
            ? new ArrayList<>()
            : productoRepository.findAllById(productoIds);
        banner.setProductos(productos);
        return ResponseEntity.ok(bannerRepository.save(banner));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

    // ── Admin: eliminar banner ──
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        bannerRepository.deleteById(id);
        return ResponseEntity.ok("Banner eliminado");
    }
}
