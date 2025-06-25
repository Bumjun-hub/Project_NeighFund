package org.project.neighfund.domain.fund;

import jakarta.persistence.*;
import lombok.*;
import org.project.neighfund.enums.FundImageType;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder
public class FundImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include //?
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FundImageType imageType;

    private String imgUrl; // filePath + "/" + fileName

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fund_id", nullable = true)
    private Fund fund;
}
