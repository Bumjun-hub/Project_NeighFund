package org.project.neighfund.domain.gathering;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder
public class PostImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include //?
    private Long id;

    private String imgUrl; // filePath + "/" + fileName

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gathering_post_id", nullable = true)
    private GatheringPost gatheringPost;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;
}
