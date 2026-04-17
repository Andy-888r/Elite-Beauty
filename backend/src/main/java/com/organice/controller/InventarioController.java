package com.organice.controller;

import com.organice.service.InventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/admin/inventario")
public class InventarioController {
    @Autowired private InventarioService service;

    @GetMapping
    public ResponseEntity<?> listar() { return ResponseEntity.ok(service.listarInventario()); }

    @GetMapping("/historial")
    public ResponseEntity<?> historial() { return ResponseEntity.ok(service.listarHistorial()); }

    @PostMapping("/movimiento")
    public ResponseEntity<?> movimiento(@RequestBody Map<String, Object> body) {
        try {
            service.registrarMovimiento((Integer) body.get("idProducto"),
                (Boolean) body.get("esEntrada"), (Integer) body.get("cantidad"), (String) body.get("motivo"));
            return ResponseEntity.ok("Movimiento registrado");
        } catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
}
