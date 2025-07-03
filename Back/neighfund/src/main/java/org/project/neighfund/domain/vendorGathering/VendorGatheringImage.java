package org.project.neighfund.domain.vendorGathering;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder
public class VendorGatheringImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include //?
    private Long id;

    private String imgUrl; // filePath + "/" + fileName

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_gathering_id", nullable = true)
    private VendorGathering vendorGathering;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;
}
