package com.tiduswr.movies_server.config.rbmq;

public enum QueueType {
    
    IMAGEM_QUEUE("user-image-proc"),
    VIDEO_QUEUE("video-proc");

    private final String taskName;

    QueueType(String taskName){
        this.taskName = taskName;
    }

    public String getQueue(){
        return taskName + "_queue";
    }

    public String getExchange(){
        return taskName + "_exchange";
    }

    public String getRoutingKey(){
        return taskName + "_routing_key";
    }

}