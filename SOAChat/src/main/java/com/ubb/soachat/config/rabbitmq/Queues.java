package com.ubb.soachat.config.rabbitmq;

public enum Queues {
    DEFAULT_QUEUE("soachat_queue");

    private final String queueName;

    Queues(String queueName) {
        this.queueName = queueName;
    }

    public String getQueueName() {
        return this.queueName;
    }
}
