package com.blakbear.bearcub.sensor;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/alerts")
@RequiredArgsConstructor
@Slf4j
public class SensorAlertController {
    private final SensorAlertProducerService sensorAlertProducerService;

    @PostMapping("new")
    void newAlertRequest(@RequestBody NewSensorAlertRequest newSensorAlertRequest) {
        log.info("New Sensor Alert Request received");
        sensorAlertProducerService.produceNewAlert(newSensorAlertRequest);
    }
}
