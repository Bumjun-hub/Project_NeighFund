package org.project.neighfund.application.fund.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.project.neighfund.enums.CommunityCategory;
import org.project.neighfund.enums.FundStatus;
import org.project.neighfund.enums.FundType;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundListDto {
    private Long id;
    private CommunityCategory category;
    private FundType fundType;
    private FundStatus fundStatus;
    private String title;
    private String subTitle;
    private String imageUrl;
    private Integer progressRate;  //달성률
    private Integer targetAmount;  //목표금액
    private Long currentAmount;  //현재 모인 금액
    private LocalDateTime deadline;  //마감일
}
