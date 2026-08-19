package com.ocs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OnlineClinicSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(OnlineClinicSystemApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" Online Clinic System (OCS) Backend Started!");
        System.out.println(" Server running on: http://localhost:8080");
        System.out.println("=================================================");
    }
}
