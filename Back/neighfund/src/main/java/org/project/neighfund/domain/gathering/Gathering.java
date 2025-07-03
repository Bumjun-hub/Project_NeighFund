package org.project.neighfund.domain.gathering;

import jakarta.persistence.*;
import lombok.*;
import org.project.neighfund.domain.common.BaseEntity;
import org.project.neighfund.domain.like.Like;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.GatheringCategory;
import org.project.neighfund.enums.GatheringType;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Gathering extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GatheringCategory category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String dongName;

    @Column(nullable = false)
    private String titleImage;

    @Column(nullable = false)
    @Builder.Default
    private int memberCount = 0; // 총 멤버 수

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GatheringType type; // FREE or VENDOR

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @OneToMany(mappedBy = "gathering", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GatheringMember> members; // 참여자 목록

    @OneToMany(mappedBy = "gathering", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Blacklist> blacklists; // 블랙리스트

    @OneToMany(mappedBy = "gathering", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GatheringPost> posts; // 게시판 글

    @OneToMany(mappedBy = "gathering", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GatheringPhoto> photos; // 사진첩

    @OneToMany(mappedBy = "gathering", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes;

}
