package org.project.neighfund.application.like.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.like.service.LikeService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.LikeEntityType;
import org.project.neighfund.global.dto.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;

    @PostMapping("/{entityType}/{postId}")
    public ResponseEntity<?> toggleLike(@PathVariable LikeEntityType entityType,
                                        @PathVariable Long postId,
                                        @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Member m = userDetails.getMember();
            String type = entityType.name();

            // 좋아요 토글
            boolean liked = likeService.toggleLike(m, type, postId);

            // 현재 좋아요 수 조회
            long likeCount = likeService.getLikeCount(type, postId);

            // 응답에 liked 상태와 count 포함
            Map<String, Object> response = new HashMap<>();
            response.put("liked", liked);
            response.put("likeCount", likeCount);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("좋아요 토글 실패 " + e.getMessage()));
        }
    }


    @GetMapping("/count/{entityType}/{postId}")
    public ResponseEntity<?> getLikeCount(@PathVariable LikeEntityType entityType,
                                          @PathVariable Long postId) {
        try {
            String type = entityType.name();
            long count = likeService.getLikeCount(type, postId);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("좋아요 조회 실패" + e.getMessage()));
        }
    }


}