package org.project.neighfund.domain.comment;

import jakarta.persistence.*;
import lombok.*;
import org.project.neighfund.domain.common.BaseEntity;
import org.project.neighfund.domain.community.Community;
import org.project.neighfund.domain.gathering.GatheringPost;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.vendorGathering.VendorGathering;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gathering_post_id", nullable = true)
    private GatheringPost gatheringPost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = true)
    private Community community;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_gathering_id", nullable = true)
    private VendorGathering vendorGathering;
}