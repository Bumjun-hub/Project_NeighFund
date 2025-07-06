package org.project.neighfund.application.websocket.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.websocket.dto.NotificationResponse;
import org.project.neighfund.application.websocket.service.NotificationService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;
import org.project.neighfund.domain.websocket.Notification;
import org.project.neighfund.domain.websocket.NotificationRepository;
import org.project.neighfund.global.dto.MessageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final MemberRepository memberRepository;
    private final NotificationRepository notificationRepository;

    //내 알림 전부 조회
    @GetMapping("/get")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Member m = userDetails.getMember();
        validateMember(m);

        List<NotificationResponse> responses = notificationRepository.findByMemberId(m.getId())
                .stream()
                .map(notifications ->  NotificationResponse.builder()
                        .id(notifications.getId())
                        .type(notifications.getType())
                        .content(notifications.getContent())
                        .communityId(notifications.getCommunity() != null ? notifications.getCommunity().getId() : null)
                        .gatheringPostId(notifications.getGatheringPost() != null ? notifications.getGatheringPost().getId() : null)
                        .vendorGatheringId(notifications.getVendorGathering() != null ? notifications.getVendorGathering().getId() : null)
                        .isRead(notifications.getIsRead())
                        .createdAt(notifications.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    // 읽지 않은 알림 총 갯수
    @GetMapping("/count/unread")
    public Long countUnread(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Member m = userDetails.getMember();
        validateMember(m);
        return notificationRepository.countByMemberIdAndIsReadFalse(m.getId());
    }

    // 읽음 처리
    @PostMapping("/{id}/read")
    public ResponseEntity<MessageResponse> markAsRead(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member m = userDetails.getMember();
        validateMember(m);

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("알림 없음"));

        if (!notification.getMember().getId().equals(m.getId())) {
            throw new AccessDeniedException("다른 사람의 알림을 수정할 수 없습니다.");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);

        return ResponseEntity.ok(new MessageResponse("알람 읽음처리 완료"));
    }


    // 사용자 정보 확인
    public void validateMember (Member m){
        Member member = memberRepository.findById(m.getId())
                .orElseThrow(() -> new IllegalArgumentException("해당사용자가 존재하지 않습니다"));

        if (!member.getEmail().equals(m.getEmail())) {
            throw new AccessDeniedException("사용자 정보가 일치하지 않습니다.");
        }
    }
}
