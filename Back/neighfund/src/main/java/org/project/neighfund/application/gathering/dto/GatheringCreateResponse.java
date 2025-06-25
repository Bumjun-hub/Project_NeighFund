package org.project.neighfund.application.gathering.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.project.neighfund.enums.GatheringCategory;

@Getter
@Setter
@AllArgsConstructor
public class GatheringCreateResponse {
    private String title;
    private String message;
}
