package org.project.neighfund.application.survey.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyOptionResponseDto { //option리스트로 보여주기

    private Long optionId;
    private String content;
    private int voteCount;
    private boolean selected;  //선택여부
    private int percentage;

}
