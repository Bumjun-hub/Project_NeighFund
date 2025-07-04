package org.project.neighfund.application.survey.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyUserResponseDto { //항목보기(사용자)
    private Long surveyId;
    private String title;
    private List<SurveyOptionResponseDto> options;
    private int totalCount;  //전체투표수
    private boolean voted;  //참여여부
    private boolean showResult; // 항목 별 count표시할지말지

}
