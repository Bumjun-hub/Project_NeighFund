package org.project.neighfund.domain.vendorGathering;


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
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorGathering extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GatheringCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GatheringType type; //vendor

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String dongName;

    @Column(nullable = false)
    private String titleImage;

    @Column(nullable = false)
    @Builder.Default
    private boolean confirmed = false; // VENDOR 소모임은 기본적으로 false

    @Column(nullable = false)
    private String businessLicenseUrl; // 사업자 등록증 URL

    @Column(nullable = false)
    private long productPrice; // 상품 가격

    @Column(nullable = false)
    private String productName; // 상품 이름

    private String freeParking; // 주차 무료 여부

    private String durationHours; // 총 시간 (시간 단위)

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @OneToMany(mappedBy = "vendorGathering", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VendorGatheringImage> images; // 상품 사진 목록

    @OneToMany(mappedBy = "vendorGathering", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReservationSlot> reservationSlots; // 예약 슬롯

    @OneToMany(mappedBy = "vendorGathering", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes; // 원데이클래스 게시글
}
