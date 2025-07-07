package org.project.neighfund.application.survey.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class VoteResultResponseDto {
    private List<SurveyOptionResponseDto> options;
    private int totalParticipants;
}
