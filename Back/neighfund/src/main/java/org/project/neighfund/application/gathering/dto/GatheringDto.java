package org.project.neighfund.application.gathering.dto;

import lombok.*;
import org.project.neighfund.enums.GatheringCategory;
import org.project.neighfund.enums.GatheringType;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class GatheringDto {
    private String title;
    private GatheringCategory category;
    private String dongName;
    private String content;
    private String introduction; // 한줄 소개
    private String nickname; // 소모임별 닉네임
    private GatheringType type; // FREE OR VENDOR
}
