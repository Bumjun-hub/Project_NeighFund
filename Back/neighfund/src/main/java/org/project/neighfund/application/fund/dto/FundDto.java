package org.project.neighfund.application.fund.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.project.neighfund.enums.CommunityCategory;
import org.project.neighfund.enums.FundStatus;
import org.project.neighfund.enums.FundType;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class  FundDto {
    private CommunityCategory category;
    private FundType fundType;
    private FundStatus fundStatus;
    private String title;
    private String subTitle;
    private String content;
    private Integer targetAmount;  //목표금액
    private LocalDateTime deadline;  //마감일
    private String hashTags;
    private List<FundOptionDto> options;
}
