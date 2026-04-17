package com.organice.controller;
 
import com.organice.dto.CompraRequest;
import com.organice.model.Cliente;
import com.organice.repository.ClienteRepository;
import com.organice.repository.HistorialCompraRepository;
import com.organice.repository.ProductoRepository;
import com.organice.service.CompraService;
import com.organice.service.LocalStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.stream.Collectors;
 
@RestController
@RequestMapping("/cliente")
public class ClienteController {
    @Autowired private ClienteRepository clienteRepo;
    @Autowired private HistorialCompraRepository historialRepo;
    @Autowired private ProductoRepository productoRepo;
    @Autowired private CompraService compraService;
    @Autowired private LocalStorageService storageService; // ← mismo servicio que usas en proveedores
 
    @GetMapping("/{id}")
    public ResponseEntity<?> perfil(@PathVariable Integer id) {
        return clienteRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
 
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Cliente datos) {
        return clienteRepo.findById(id).map(c -> {
            c.setNombreCompleto(datos.getNombreCompleto());
            c.setTelefono(datos.getTelefono());
            c.setCorreo(datos.getCorreo());
            c.setDireccion(datos.getDireccion());
            c.setPreferencias(datos.getPreferencias());
            return ResponseEntity.ok(clienteRepo.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }
 
    // ← NUEVO: subir foto de perfil
    @PostMapping(value = "/{id}/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> subirFoto(
            @PathVariable Integer id,
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
 
    @GetMapping("/{id}/historial")
    public ResponseEntity<?> historial(@PathVariable Integer id) {
        return ResponseEntity.ok(historialRepo.findByClienteIdOrderByFechaDesc(id));
    }
 
    @PostMapping("/compra")
    public ResponseEntity<?> comprar(@RequestBody CompraRequest req) {
        try {
            double total = compraService.procesarCompra(req);
            String nombre = clienteRepo.findById(req.getIdCliente())
                .map(Cliente::getNombreCompleto).orElse("Cliente");
 
            List<String> nombres = req.getItems().stream()
                .map(i -> productoRepo.findById(i.getIdProducto())
                    .map(p -> p.getNombre())
                    .orElse("Producto #" + i.getIdProducto()))
                .collect(Collectors.toList());
 
            byte[] pdf = compraService.generarTicketPDF(nombre, req.getItems(), nombres, total);
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ticket.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}