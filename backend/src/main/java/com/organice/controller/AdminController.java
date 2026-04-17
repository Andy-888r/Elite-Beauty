package com.organice.controller;

import com.organice.model.*;
import com.organice.repository.*;
import com.organice.service.LocalStorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/admin") //
public class AdminController {

    @Autowired private ClienteRepository clienteRepo;
    @Autowired private ProveedorRepository proveedorRepo;
    @Autowired private AdministradorRepository adminRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private LocalStorageService storageService;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private HistorialCompraRepository historialCompraRepo;

    // ── CLIENTES ──
    @GetMapping("/clientes")
    public List<Cliente> clientes() {
        return clienteRepo.findAll();
    }

    @DeleteMapping("/clientes/{id}")
    public ResponseEntity<?> eliminarCliente(@PathVariable Integer id) {
        clienteRepo.deleteById(id);
        return ResponseEntity.ok("Eliminado");
    }

    // ── PROVEEDORES ──
    @GetMapping("/proveedores")
    public List<Proveedor> proveedores() {
        return proveedorRepo.findAll();
    }

    @PostMapping(value = "/proveedores", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crearProveedor(
            @RequestPart("proveedor") String json,
            @RequestPart(value = "logo", required = false) MultipartFile logo) {
        try {
            Proveedor p = objectMapper.readValue(json, Proveedor.class);
            if (logo != null && !logo.isEmpty()) {
                p.setLogoPath(storageService.guardarImagen(logo));
            }
            return ResponseEntity.ok(proveedorRepo.save(p));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping(value = "/proveedores/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> actualizarProveedor(
            @PathVariable Integer id,
            @RequestPart("proveedor") String json,
            @RequestPart(value = "logo", required = false) MultipartFile logo) {
        try {
            Proveedor existente = proveedorRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

            Proveedor datos = objectMapper.readValue(json, Proveedor.class);

            existente.setNombre(datos.getNombre());
            existente.setEmpresa(datos.getEmpresa());
            existente.setUrl(datos.getUrl());
            existente.setActivo(datos.getActivo());

            if (logo != null && !logo.isEmpty()) {
                existente.setLogoPath(storageService.guardarImagen(logo));
            }

            return ResponseEntity.ok(proveedorRepo.save(existente));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/proveedores/{id}")
    public ResponseEntity<?> eliminarProveedor(@PathVariable Integer id) {
        proveedorRepo.deleteById(id);
        return ResponseEntity.ok("Eliminado");
    }

    // ── ADMINS ──
    @GetMapping("/admins")
    public List<Administrador> admins() {
        return adminRepo.findAll();
    }

    @PostMapping("/admins")
    public ResponseEntity<?> crearAdmin(@RequestBody Administrador a) {
        a.setContrasena(passwordEncoder.encode(a.getContrasena()));
        return ResponseEntity.ok(adminRepo.save(a));
    }

    // ═══════════════════════════════
    // 📊 REPORTES
    // ═══════════════════════════════

    @GetMapping("/reportes/top-productos")
    public ResponseEntity<?> topProductos() {
        List<Object[]> raw = historialCompraRepo.topProductosVendidos();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : raw) {
            Map<String, Object> item = new HashMap<>();
            item.put("nombre", row[0]);
            item.put("cantidad", row[1]);
            item.put("total", row[2]);
            result.add(item);
        }

        return ResponseEntity.ok(result);
    }

@GetMapping("/reportes/ventas-por-dia")
public ResponseEntity<?> ventasPorDia() {
    try {
        LocalDateTime desde = LocalDateTime.now().minusDays(30);
        List<Object[]> raw = historialCompraRepo.ventasPorDia(desde);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : raw) {
            Map<String, Object> item = new HashMap<>();
            item.put("fecha",    row[0] != null ? row[0].toString() : "");
            item.put("total",    row[1]);
            item.put("cantidad", row[2]);
            result.add(item);
        }
        return ResponseEntity.ok(result);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

   
    @GetMapping("/reportes/ventas-por-categoria")
    public ResponseEntity<?> ventasPorCategoria() {
        List<Object[]> raw = historialCompraRepo.ventasPorCategoria();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : raw) {
            Map<String, Object> item = new HashMap<>();
            item.put("categoria", row[0]);
            item.put("cantidad", row[1]);
            item.put("total", row[2]);
            result.add(item);
        }

        return ResponseEntity.ok(result);
    }

@GetMapping("/reportes/totales")
public ResponseEntity<?> totalesGenerales() {
    List<Object[]> rows = historialCompraRepo.totalesGenerales();

    Map<String, Object> result = new HashMap<>();

    if (rows == null || rows.isEmpty()) {
        result.put("clientes", 0);
        result.put("ingresos", 0);
        result.put("unidades", 0);
    } else {
        Object[] row = rows.get(0); // ← el primer (y único) row
        result.put("clientes", row[0]);
        result.put("ingresos", row[1]);
        result.put("unidades", row[2]);
    }

    return ResponseEntity.ok(result);
}
}