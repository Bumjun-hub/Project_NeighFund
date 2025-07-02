package org.project.neighfund.application.Participation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipationResponseDto {

    private Long memberId;
    private String username;

    private Long optionId;         //옵션아이디
    private String optionContent;  //옵션 내용
    private Long optionPrice;      //총 옵션 가격

    private int quantity;     //신청수량
    private Long paidAmount;  // 총 금액 옵션가격 * 수량
    private LocalDateTime appliedAt;  //신청날짜

}
