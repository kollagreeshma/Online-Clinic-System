package com.ocs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OnlineClinicSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(OnlineClinicSystemApplication.class, args);
        System.out.println("=================================================");
        String port = System.getenv("PORT") != null ? System.getenv("PORT") : "8080";
        System.out.println(" Server running on port: " + port);
        System.out.println("=================================================");
    }
}
