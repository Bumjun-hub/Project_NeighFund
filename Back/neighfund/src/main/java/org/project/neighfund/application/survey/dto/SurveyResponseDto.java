package org.project.neighfund.application.survey.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyResponseDto {  //설문목록보기(관리자)
    private Long surveyId;
    private String title;
    private LocalDateTime createdAt;
    private boolean visible;
    private int totalVotes;

}
