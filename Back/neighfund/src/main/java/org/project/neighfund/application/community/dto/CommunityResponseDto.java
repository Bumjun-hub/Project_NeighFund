package org.project.neighfund.application.community.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityResponseDto {
    private Long id;
    private String username;
    private String category;
    private String status;
    private String title;
    private String locationName;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long likes;
    private boolean liked;  // 좋아요 여부
}
