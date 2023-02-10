package com.blakbear.bearcub.sensor;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController("api/v1")
@RequiredArgsConstructor
public class SensorAlertController {
    private final SensorAlertProducerService sensorAlertProducerService;
}
