package com.tiduswr.movies_server.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tiduswr.movies_server.config.rbmq.QueueType;
import com.tiduswr.movies_server.exceptions.JsonProcessingFailException;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TaskPublisherService {
    
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper mapper;

    public void sendToQueue(QueueType queueType, Object toJson){
        try{

            String message = mapper.writeValueAsString(toJson);

            rabbitTemplate.convertAndSend(
                queueType.getExchange(),
                queueType.getRoutingKey(),
                message
            );

        }catch(JsonProcessingException ex){
            throw new JsonProcessingFailException(ex.getMessage());
        }
    }

}
