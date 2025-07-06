package org.project.neighfund.application.comment.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.comment.dto.*;
import org.project.neighfund.application.comment.service.CommentService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.CommentEntityType;
import org.project.neighfund.global.dto.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping("/create")
    public ResponseEntity<?> createComment(@AuthenticationPrincipal CustomUserDetails userDetails,
                                           @Valid @RequestBody CommentRequest request) {
        try {
            Member m = userDetails.getMember();
            CommentResponse response = commentService.createComment(m, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("댓글 생성에 실패했습니다." + e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<MessageResponse> deleteComment(@AuthenticationPrincipal CustomUserDetails userDetails
            ,@PathVariable Long commentId) {
        try {
            Member m = userDetails.getMember();
            commentService.deleteComment(m, commentId);
            return ResponseEntity.ok(new MessageResponse("댓글 삭제 성공"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("댓글 삭제에 실패했습니다." + e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateComment(@AuthenticationPrincipal CustomUserDetails userDetails
            ,@Valid @RequestBody CommentUpdateRequest request) {
        try {
            Member m = userDetails.getMember();
            CommentUpdateResponse response = commentService.updateComment(m, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("댓글 생성에 실패했습니다." + e.getMessage()));
        }
    }

    @GetMapping("/list/{entityType}/{postId}")
    public ResponseEntity<?> listComments(@PathVariable CommentEntityType entityType, @PathVariable String postId) {
        try {
            List<CommentListResponse> commentList = commentService.getListComment(entityType, postId);
            return ResponseEntity.ok(commentList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("댓글 생성에 실패했습니다." + e.getMessage()));
        }
    }
}
