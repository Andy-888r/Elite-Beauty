package com.organice.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


public class GenerarHash {
    
     public static void main(String[] args) {
        String password = args.length > 0 ? args[0] : "admin123";
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode(password);
        System.out.println("HASH:" + hash);
    }
}
