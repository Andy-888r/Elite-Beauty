package com.organice.dto;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
@Data
public class LoginRequest {
    @NotBlank private String usuario;
    @NotBlank private String contrasena;
}
