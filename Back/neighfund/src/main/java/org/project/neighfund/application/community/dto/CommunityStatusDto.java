package org.project.neighfund.application.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.project.neighfund.enums.CommunityStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityStatusDto {
    private CommunityStatus status;
}
