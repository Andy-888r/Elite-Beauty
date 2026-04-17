package com.organice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class LocalStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    /**
     * Guarda la imagen en disco local y devuelve la URL pública relativa.
     * Ejemplo: /uploads/productos/uuid-imagen.png
     */
    public String guardarImagen(MultipartFile file) throws IOException {
        Path dirPath = Paths.get(uploadDir);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        String extension = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            extension = original.substring(original.lastIndexOf("."));
        }

        String nombreArchivo = UUID.randomUUID().toString() + extension;
        Path destino = dirPath.resolve(nombreArchivo);
        Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

        // URL pública accesible desde React
        return "/uploads/productos/" + nombreArchivo;
    }

    /**
     * Elimina una imagen del disco local.
     */
    public void eliminarImagen(String urlRelativa) {
        try {
            // urlRelativa ejemplo: /uploads/productos/uuid.png
            String nombreArchivo = Paths.get(urlRelativa).getFileName().toString();
            Path archivo = Paths.get(uploadDir).resolve(nombreArchivo);
            Files.deleteIfExists(archivo);
        } catch (IOException e) {
            System.err.println("Advertencia: no se pudo eliminar imagen local: " + e.getMessage());
        }
    }
}
