package org.project.neighfund.application.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.project.neighfund.enums.CommunityCategory;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityDto {
    private CommunityCategory category;
    private String locationName;
    private String title;
    private String content;
}
