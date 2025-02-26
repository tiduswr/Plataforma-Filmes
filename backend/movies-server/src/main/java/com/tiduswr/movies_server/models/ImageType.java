package com.tiduswr.movies_server.models;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ImageType {
    BIG, SMALL;

    @JsonValue
    public String toLowerCase(){
        return this.name().toLowerCase();
    }

}
