package com.organice.dto;
 
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
 
@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String rol;
    private Integer id;
    private String nombre;
    private List<String> alertas;
    private String fotoPerfil; //esta linea es para que el sidebar muestre la foto al iniciar sesión
}