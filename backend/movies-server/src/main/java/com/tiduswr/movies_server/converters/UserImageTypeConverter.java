package com.tiduswr.movies_server.converters;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.tiduswr.movies_server.models.UserImageType;

@Component
public class UserImageTypeConverter implements Converter<String, UserImageType> {
    @Override
    public UserImageType convert(String source) {
        try {
            return UserImageType.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Tipo de imagem inválido: " + source);
        }
    }
}
