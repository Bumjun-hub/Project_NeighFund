package org.project.neighfund.application.gathering.dto;

import lombok.*;
import org.project.neighfund.domain.like.Like;
import org.project.neighfund.enums.GatheringPostCategory;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroupPostDto {
    private long id;
    private String username;
    private String title;
    private String content;
    private GatheringPostCategory category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long viewCount;
    private Long likes;
    private List<String> imgUrls;
}
