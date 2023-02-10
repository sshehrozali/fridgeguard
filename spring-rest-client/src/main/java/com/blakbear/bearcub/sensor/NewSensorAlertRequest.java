package com.blakbear.bearcub.sensor;

import lombok.Builder;

import java.util.List;

@Builder
public record NewSensorAlertRequest(
        String batchName,
        String bearcub,
        String alertReceivedAt
) {
}
