package org.project.neighfund.application.websocket.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.project.neighfund.application.websocket.dto.NotificationResponse;
import org.project.neighfund.domain.community.Community;
import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.fund.FundRepository;
import org.project.neighfund.domain.gathering.GatheringPost;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;
import org.project.neighfund.domain.participation.Participation;
import org.project.neighfund.domain.participation.ParticipationRepository;
import org.project.neighfund.domain.vendorGathering.VendorGathering;
import org.project.neighfund.domain.websocket.Notification;
import org.project.neighfund.domain.websocket.NotificationRepository;
import org.project.neighfund.enums.NotificationType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final MemberRepository memberRepository;
    private final FundRepository fundRepository;
    private final ParticipationRepository participationRepository;

    @Transactional
    public void createAndSendNotification(Member m, NotificationType type, String content,
                                          Community community, GatheringPost post, VendorGathering vendor, Fund fund) {
        // DB에 저장
        Notification notification = Notification.builder()
                .member(m)
                .type(type)
                .content(content)
                .community(community)
                .gatheringPost(post)
                .vendorGathering(vendor)
                .build();
        notificationRepository.save(notification);

        NotificationResponse response = NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .content(notification.getContent())
                .communityId(community != null ? community.getId() : null)
                .gatheringPostId(post != null ? post.getId() : null)
                .vendorGatheringId(vendor != null ? vendor.getId() : null)
                .category(community != null ? String.valueOf(community.getCategory()) : null) // ✅ 이 줄 추가
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();

        // 사용자별 알람 전송
        log.info("🔔 {}에게 알림 전송: {}", m.getUsername(), content);
        messagingTemplate.convertAndSendToUser(
                m.getEmail()
                ,"/topic/notification"
                ,response);
    }

    // 펀드 오픈 알림 (모든 사용자)
    @Transactional
    public void sendFundOpenToAll(Fund fund, String content) {
        // 모든 회원 조회
        List<Member> members = memberRepository.findAll();

        // 사용자별 알람 전송
        log.info("🔔 {}펀드 오픈 알림 전송: {}", fund.getTitle(), content);
        for (Member member : members) {
            createAndSendNotification(member, NotificationType.FUND_OPENED, content, null, null, null, fund);
        }
    }

    @Transactional
    public void sendGruopBuyCompletedToParticipants(Long fundId, String content) {
        Fund fund = fundRepository.findById(fundId)
                .orElseThrow(() -> new RuntimeException("유효하지 않은 펀드 게시글 번호입니다."));
        List<Member> participants = participationRepository.findByFundId(fundId)
                .stream()
                .map(Participation::getMember)
                .collect(Collectors.toList());

        // 사용자별 알람 전송
        log.info("🔔 {}펀드 마감 알림 전송: {}", fund.getTitle(), content);
        for (Member participant : participants) {
            createAndSendNotification(participant, NotificationType.FUND_COMPLETED, content, null, null, null, fund);
        }
    }

}
