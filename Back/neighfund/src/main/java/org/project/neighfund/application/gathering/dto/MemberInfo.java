package org.project.neighfund.application.gathering.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberInfo {
    private Long id;
    private String nickname;        // 소모임별 닉네임
    private String introduction;    // 한줄 소개
    private String imageUrl;        // 프로필 이미지 URL
    private String role;            // "LEADER" or "USER"
    private LocalDateTime joinedAt; // 참여일
}
