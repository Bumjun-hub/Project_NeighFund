package org.project.neighfund.application.gathering.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class JoinGatheringDto {
    private String introduction;
    private String imageUrl;
    private String nickname; // 소모임별 닉네임
}
