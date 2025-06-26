package org.project.neighfund.application.gathering.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.project.neighfund.enums.GatheringPostCategory;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class GatheringPostResponse {
    private String title;
    private String content;
    private GatheringPostCategory category;
}
