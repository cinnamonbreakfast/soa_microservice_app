package com.ubb.soachat.worker;

import com.ubb.soachat.config.rabbitmq.Queues;
import com.ubb.soachat.dto.TestDTO;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class Consumer {
    @RabbitListener(queues = "soachat-queue")
    public void consumeMessagesFromTheQueue(TestDTO testDTO) {
        System.out.println("Consumer: received message " + testDTO);
    }
}
