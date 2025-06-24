package org.project.neighfund.application.fund.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.project.neighfund.domain.fund.FundImage;
import org.project.neighfund.enums.CommunityCategory;
import org.project.neighfund.enums.FundImageType;
import org.project.neighfund.enums.FundStatus;
import org.project.neighfund.enums.FundType;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundDto {
    private CommunityCategory category;
    private FundType fundType;
    private FundStatus fundStatus;
    private String title;
    private String subTitle;
    private String content;
    private FundImageType imageType; //이미지타입
    private List<FundImage> fundImages ; //이미지
    private Integer targetAmount;  //목표금액
    private LocalDateTime deadline;  //마감일

}
