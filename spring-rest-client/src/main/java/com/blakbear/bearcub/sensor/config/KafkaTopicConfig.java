package com.blakbear.bearcub.sensor.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {
    @Bean
    public NewTopic alertsTopic() {
        return TopicBuilder
                .name("alerts")
                .build();
    }
}
