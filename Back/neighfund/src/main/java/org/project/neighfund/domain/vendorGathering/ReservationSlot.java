package org.project.neighfund.domain.vendorGathering;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vendor_product_id", nullable = false)
    private VendorGathering vendorGathering;

    @Column(nullable = false)
    private LocalDateTime startTime; // 예약 시작 시간

    @Column(nullable = false)
    private LocalDateTime endTime; // 예약 종료 시간

    @Column(nullable = false)
    private int maxParticipants; // 해당 상품의 최대 예약 가능 인원

    @Column(nullable = false)
    @Builder.Default
    private int currentParticipants = 0; // 현재 예약된 인원
}
