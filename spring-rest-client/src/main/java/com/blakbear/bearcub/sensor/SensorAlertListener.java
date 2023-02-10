package com.blakbear.bearcub.sensor;

import lombok.extern.log4j.Log4j;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class SensorAlertListener {
    @KafkaListener(topics = "alerts", groupId = "groupId")
    public void listener(String data) {
        log.info("Alert received: " + data);
    }
}
