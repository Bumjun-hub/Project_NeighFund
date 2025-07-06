package org.project.neighfund.domain.gathering;

import jakarta.persistence.*;
import lombok.*;
import org.project.neighfund.domain.comment.Comment;
import org.project.neighfund.domain.common.BaseEntity;
import org.project.neighfund.domain.like.Like;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.websocket.Notification;
import org.project.neighfund.enums.GatheringPostCategory;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GatheringPost extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "gathering_id", nullable = false)
    private Gathering gathering;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GatheringPostCategory category;

    @Column(name = "view_count", columnDefinition = "BIGINT DEFAULT 0")
    @Builder.Default
    private Long viewCount = 0L;

    @OneToMany(mappedBy = "gatheringPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostImage> postImages;

    @OneToMany(mappedBy = "gatheringPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes;

    @OneToMany(mappedBy = "gatheringPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    @OneToMany(mappedBy = "gatheringPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications;
}
