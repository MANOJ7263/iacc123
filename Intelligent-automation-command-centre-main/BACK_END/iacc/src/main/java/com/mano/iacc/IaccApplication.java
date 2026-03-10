package com.mano.iacc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class IaccApplication {

	public static void main(String[] args) {
		SpringApplication.run(IaccApplication.class, args);
	}

}
