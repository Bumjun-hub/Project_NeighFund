package org.project.neighfund.application.vendorGathering.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationDto {

    private Long gatheringId;      // 어떤 클래스인지
    private LocalDate date;        // 사용자가 고른 날짜
    private LocalTime startTime;   // 시작 시각
    private LocalTime endTime;     // 끝 시각
    private int participantCount;  // 인원
    private String paymentBank;     // 입금 은행
    private String paymentName;      // 입금자명
}
