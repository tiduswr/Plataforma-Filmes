package com.tiduswr.movies_server.models;

import com.fasterxml.jackson.annotation.JsonValue;

public enum UserImageType {
    BIG, SMALL;

    @JsonValue
    public String toLowerCase(){
        return this.name().toLowerCase();
    }

}
