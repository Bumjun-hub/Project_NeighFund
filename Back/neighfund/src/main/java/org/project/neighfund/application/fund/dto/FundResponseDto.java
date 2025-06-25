package org.project.neighfund.application.fund.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.project.neighfund.domain.fund.FundImage;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.CommunityCategory;
import org.project.neighfund.enums.FundStatus;
import org.project.neighfund.enums.FundType;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundResponseDto {
    private Long id;
    private String username;
    private CommunityCategory category;
    private FundType fundType;
    private FundStatus fundStatus;
    private String title;
    private String subTitle;
    private String content;
    private List<FundImage> fundImages;
    private Integer progressRate;  //달성률
    private Integer targetAmount;  //목표금액
    private Integer currentAmount;  //현재 모인 금액
    private Integer currentParticipants = 0;  //현재참여자
    private LocalDateTime deadline;  //마감일
    private Long likes;
    private boolean liked;  // 좋아요 여부

}
