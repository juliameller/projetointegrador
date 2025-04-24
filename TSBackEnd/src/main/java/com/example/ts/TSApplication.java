package com.example.ts;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;


@SpringBootApplication
@EntityScan("com.example.ts")  // Certifique-se de que o pacote está correto

public class TSApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder(TSApplication.class).run(args);
    }
}
