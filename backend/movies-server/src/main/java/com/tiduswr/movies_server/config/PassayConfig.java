package com.tiduswr.movies_server.config;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

import org.passay.PropertiesMessageResolver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

@Configuration
public class PassayConfig {

    private final ResourceLoader resourceLoader;

    public PassayConfig(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Value("${passay.messages.ptbr}")
    private String messagesFilePath;

    @Bean
    PropertiesMessageResolver messageResolver() throws FileNotFoundException, IOException {
        Resource resource = resourceLoader.getResource(messagesFilePath);
        Properties props = new Properties();
        props.load(resource.getInputStream());
        return new PropertiesMessageResolver(props);
    }

}