package org.project.neighfund.domain.vendorGathering;

import jakarta.persistence.*;
import lombok.*;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.OrderStatus;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private ReservationSlot reservationSlot;  //예약날짜,시간

    @Column(nullable = false)
    private int participantCount;  //예약인원

    @Column(name = "payment_name", nullable = false)
    private String paymentName;  //입금자명(사용자)

    @Column(name = "payment_bank", nullable = false)
    private String paymentBank;  //입금음행(사용자)

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;  //상태

    @Column(nullable = false)
    private LocalDateTime reservationDateTime;  //신청일

}
