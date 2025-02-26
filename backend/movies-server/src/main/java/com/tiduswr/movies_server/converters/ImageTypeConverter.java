package com.tiduswr.movies_server.converters;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.tiduswr.movies_server.models.ImageType;

@Component
public class ImageTypeConverter implements Converter<String, ImageType> {
    @Override
    public ImageType convert(String source) {
        try {
            return ImageType.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Tipo de imagem inválido: " + source);
        }
    }
}
