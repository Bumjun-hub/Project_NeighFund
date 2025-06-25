package org.project.neighfund.domain.like;

import jakarta.persistence.*;
import lombok.*;
import org.project.neighfund.domain.community.Community;
import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.member.Member;
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
@Table(name = "likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"member_id", "community_id"}),
        @UniqueConstraint(columnNames = {"member_id", "groupBuy_id"})
})
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = true)
    private Community community;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fund_id", nullable = true)
    private Fund fund;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt; // 생성일
}