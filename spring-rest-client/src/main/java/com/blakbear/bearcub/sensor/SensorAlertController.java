package com.blakbear.bearcub.sensor;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("api/v1")
@RequiredArgsConstructor
public class SensorAlertController {
    private final SensorAlertProducerService sensorAlertProducerService;

    @PostMapping("/new/alert")
    void newAlertRequest(@RequestBody NewSensorAlertRequest newSensorAlertRequest) {
        sensorAlertProducerService.produceNewAlert(newSensorAlertRequest);
    }
}
