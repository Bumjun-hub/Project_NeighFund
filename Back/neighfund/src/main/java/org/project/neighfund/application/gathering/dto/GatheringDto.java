package org.project.neighfund.application.gathering.dto;

import lombok.*;
import org.project.neighfund.enums.GatheringCategory;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class GatheringDto {
    private String title;
    private GatheringCategory category;
    private String dongName;
    private String content;
}
