package org.project.neighfund.application.vendorGathering.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.project.neighfund.enums.OrderStatus;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationAdminResponseDto {
    private Long reservationId;
    private String classTitle;
    private LocalDate date;
    private LocalTime startTime;
    private int participantCount;
    private String paymentBank;
    private String paymentName;
    private OrderStatus status;
}
