package org.project.neighfund.domain.like;

import jakarta.persistence.*;
import lombok.*;
import org.project.neighfund.domain.community.Community;
import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.gathering.Gathering;
import org.project.neighfund.domain.gathering.GatheringPost;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.vendorGathering.VendorGathering;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "likes")
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fund_id", nullable = true)
    private Fund fund;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = true)
    private Community community;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gathering_id", nullable = true)
    private Gathering gathering;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt; // 생성일

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gathering_post_id", nullable = true)
    private GatheringPost gatheringPost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendorGathering_id", nullable = true)
    private VendorGathering vendorGathering;


}