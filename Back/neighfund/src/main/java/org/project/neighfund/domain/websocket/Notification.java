package org.project.neighfund.domain.websocket;

import jakarta.persistence.*;
import lombok.*;
import org.project.neighfund.domain.community.Community;
import org.project.neighfund.domain.gathering.GatheringPost;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.vendorGathering.VendorGathering;
import org.project.neighfund.enums.NotificationType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean isSent = true;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt; // 생성일

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = true)
    private Community community;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_gathering_id", nullable = true)
    private VendorGathering vendorGathering;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gathering_post_id", nullable = true)
    private GatheringPost gatheringPost;
}
