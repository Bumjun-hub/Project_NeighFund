package org.project.neighfund.application.gathering.dto;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.project.neighfund.enums.GatheringCategory;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class GatheringResponse {
    private Long id;
    private String title;
    private String category;
    private String content;
    private String dongName;
    private String titleImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long likes;
    private boolean liked;
    private int memberCount;

    @JsonProperty("isMember") // 🔧 이 줄 추가
    private boolean isMember;
}
