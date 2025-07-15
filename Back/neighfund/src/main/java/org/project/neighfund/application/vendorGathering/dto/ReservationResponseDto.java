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
public class ReservationResponseDto {
    private Long vendorGatheringId;
    private String classTitle;      //클래스명
    private LocalDate date;         //날짜
    private LocalTime startTime;    //시작시간
    private LocalTime endTime;      //끝나는시간
    private int participantCount;   //인원수
    private String paymentBank;
    private String paymentName;
    private OrderStatus status;
}
