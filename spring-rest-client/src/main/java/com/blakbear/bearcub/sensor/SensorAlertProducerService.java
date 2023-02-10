package com.blakbear.bearcub.sensor;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SensorAlertProducerService {
    private final KafkaTemplate<String, String> kafkaTemplate;
    public void produceNewAlert(NewSensorAlertRequest newSensorAlertRequest) {
        kafkaTemplate.send("alerts", newSensorAlertRequest.alertReceivedAt());
    }
}
