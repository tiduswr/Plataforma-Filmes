package com.tiduswr.movies_server.config.rbmq;

import java.util.ArrayList;
import java.util.List;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Declarable;
import org.springframework.amqp.core.Declarables;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    Declarables rabbitQueues(){
        List<Declarable> declarables = new ArrayList<>();
        for(QueueType qt : QueueType.values()){
            Queue q = new Queue(qt.getQueue(), true);
            DirectExchange e = new DirectExchange(qt.getExchange());
            Binding b = BindingBuilder.bind(q).to(e).with(qt.getRoutingKey());
            
            declarables.add(q);
            declarables.add(e);
            declarables.add(b);
        }

        return new Declarables(declarables);
    }

    @Bean
    Jackson2JsonMessageConverter jsonMessageConverter(){
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory){
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }

}