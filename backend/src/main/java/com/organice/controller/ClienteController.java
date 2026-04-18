package com.organice.controller;

import com.organice.dto.CompraRequest;
import com.organice.model.Cliente;
import com.organice.model.HistorialCompra;
import com.organice.repository.ClienteRepository;
import com.organice.repository.HistorialCompraRepository;
import com.organice.repository.ProductoRepository;
import com.organice.service.CompraService;
import com.organice.service.LocalStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cliente")
public class ClienteController {

    @Autowired private ClienteRepository           clienteRepo;
    @Autowired private HistorialCompraRepository   historialRepo;
    @Autowired private ProductoRepository          productoRepo;
    @Autowired private CompraService               compraService;
    @Autowired private LocalStorageService         storageService;

    // ── Perfil ──
    @GetMapping("/{id}")
    public ResponseEntity<?> perfil(@PathVariable Integer id) {
        return clienteRepo.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // ── Actualizar perfil ──
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id,
                                         @RequestBody Cliente datos) {
        return clienteRepo.findById(id).map(c -> {
            c.setNombreCompleto(datos.getNombreCompleto());
            c.setTelefono(datos.getTelefono());
            c.setCorreo(datos.getCorreo());
            c.setDireccion(datos.getDireccion());
            c.setPreferencias(datos.getPreferencias());
            return ResponseEntity.ok(clienteRepo.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Subir foto de perfil ──
    @PostMapping(value = "/{id}/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> subirFoto(@PathVariable Integer id,
                                        @RequestPart("foto") MultipartFile foto) {
        return clienteRepo.findById(id).map(c -> {
            try {
                String ruta = storageService.guardarImagen(foto);
                c.setFotoPerfil(ruta);
                clienteRepo.save(c);
                return ResponseEntity.ok(ruta);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Historial de compras ──
    @GetMapping("/{id}/historial")
    public ResponseEntity<?> historial(@PathVariable Integer id) {
        return ResponseEntity.ok(historialRepo.findByClienteIdOrderByFechaDesc(id));
    }

    // ── Realizar compra ──
    @PostMapping("/compra")
    public ResponseEntity<?> comprar(@RequestBody CompraRequest req) {
        try {
            CompraService.ResultadoCompra resultado = compraService.procesarCompra(req);

            Cliente cli = req.getIdCliente() != null
                ? clienteRepo.findById(req.getIdCliente()).orElse(null) : null;
            String nombre = cli != null ? cli.getNombreCompleto() : "Cliente";
            String correo = cli != null ? cli.getCorreo() : null;

            List<String> nombres = req.getItems().stream()
                .map(i -> productoRepo.findById(i.getIdProducto())
                    .map(p -> p.getNombre())
                    .orElse("Producto #" + i.getIdProducto()))
                .collect(Collectors.toList());

            byte[] pdf = compraService.generarTicketPDF(nombre, correo, req.getItems(), nombres, resultado.total);
            String filename = "ticket-" + resultado.idOrden.substring(0, 8) + ".pdf";
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .header("X-Id-Orden", resultado.idOrden)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Descargar ticket desde historial ──
   @GetMapping("/{id}/ticket")
public ResponseEntity<?> descargarTicket(@PathVariable Integer id,
                                          @RequestParam String idOrden) {
    try {
        List<HistorialCompra> compras = historialRepo.findByIdOrden(idOrden);

        if (compras.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Cliente cli = compras.get(0).getCliente();
        String nombreCliente = cli != null ? cli.getNombreCompleto() : "Cliente";
        String correoCliente = cli != null ? cli.getCorreo() : null;

        List<CompraRequest.ItemCompra> items  = new ArrayList<>();
        List<String>                  nombres = new ArrayList<>();

        for (HistorialCompra h : compras) {
            CompraRequest.ItemCompra item = new CompraRequest.ItemCompra();
            item.setIdProducto(h.getProducto().getId());
            item.setCantidad(h.getCantidad());
            item.setPrecio(h.getTotal() != null && h.getCantidad() > 0
                ? h.getTotal() / h.getCantidad() : 0);
            items.add(item);
            nombres.add(h.getProducto().getNombre());
        }

        double total = compras.stream()
            .mapToDouble(h -> h.getTotal() != null ? h.getTotal() : 0)
            .sum();

        byte[] pdf = compraService.generarTicketPDF(
            nombreCliente, correoCliente, items, nombres, total);

        String filename = "ticket-" + (idOrden != null && idOrden.length() >= 8
            ? idOrden.substring(0, 8) : "compra") + ".pdf";
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=" + filename)
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
}