package org.project.neighfund.application.vendorGathering.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GatheringVendorResponse {
    private Long id;
    private Long productId;
    private String title;
    private String category;
    private String content;
    private String dongName;
    private String titleImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long likes;
    private boolean liked;  // 좋아요 여부
    private int memberCount;
}
