package org.project.neighfund.application.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.project.neighfund.enums.NotificationType;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private NotificationType type;
    private String content;
    private Long communityId;
    private Long gatheringPostId;
    private Long vendorGatheringId;
    private String category;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
