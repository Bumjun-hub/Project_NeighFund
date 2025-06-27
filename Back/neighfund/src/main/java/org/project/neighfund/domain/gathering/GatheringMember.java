package org.project.neighfund.domain.gathering;

import jakarta.persistence.*;
import lombok.*;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.GatheringRole;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"gathering_id", "member_id"}))
public class GatheringMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "gathering_id", nullable = false)
    private Gathering gathering;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GatheringRole role; // LEADER or USER

    @Column(length = 100)
    private String introduction; // 한줄 소개

    @Column
    private String imageUrl; // 소모임별 프로필 사진 URL

    @Column(length = 50, nullable = false)
    private String nickname; // 소모임별 닉네임

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt; // 생성일
}
