package com.ubb.soachat.controller;

import com.ubb.soachat.config.rabbitmq.Queues;
import com.ubb.soachat.dto.TestDTO;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class TestController {

    private final RabbitTemplate rabbitTemplate;
    private final String exchangeName;
    private final String routingKey;

    public TestController(
            RabbitTemplate rabbitTemplate,
            @Value("${rabbit-mq.exchange}") String exchangeName,
            @Value("${rabbit-mq.routing-key}") String routingKey
    ) {
        this.rabbitTemplate = rabbitTemplate;
        this.routingKey = routingKey;
        this.exchangeName = exchangeName;
    }

    @PostMapping("/test")
    public String testEndpoint(@RequestBody TestDTO testDTO) {
        rabbitTemplate.convertAndSend(exchangeName, routingKey, testDTO);

        System.out.println("Producer: sent message" + testDTO);

        return "Sent message";
    }

    @GetMapping("/health")
    public String healthcheck() {
        return "{ \"status\": \"OK\" }";
    }
}
