package org.project.neighfund.domain.fund;

import jakarta.persistence.*;
import lombok.*;
import org.project.neighfund.domain.common.BaseEntity;
import org.project.neighfund.domain.like.Like;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.CommunityCategory;
import org.project.neighfund.enums.FundStatus;
import org.project.neighfund.enums.FundType;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Fund extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommunityCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FundType fundType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FundStatus fundStatus;

    @Column(name = "is_approved", nullable = false)
    private Boolean isApproved = false; // 검수상태 false -> 안보임

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String subTitle;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    @OneToMany(mappedBy = "fund", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FundImage> fundImages ;

    @OneToMany(mappedBy = "fund", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FundContentImage> fundContentImages ;

    @Column(name = "current_participants", nullable = false)
    private Integer currentParticipants = 0;  //현재참여자

    @Column(name = "target_amount", nullable = false)
    private Integer targetAmount;  //목표금액

    @Column(name = "current_amount", nullable = false)
    private Long currentAmount = 0L;  //현재 모인 금액

    @Column(name = "progressRate", nullable = false)
    private Integer progressRate;  //달성률

    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;  //마감일

    @Column(name = "hash_tags")
    private String hashTags;

    @OneToMany(mappedBy = "fund", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FundOption> fundOptions ;

    @OneToMany(mappedBy = "fund", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes;

}
