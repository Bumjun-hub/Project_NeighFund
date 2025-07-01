package org.project.neighfund.domain.participation;

import jakarta.persistence.*;
import lombok.*;
import org.project.neighfund.domain.common.BaseEntity;
import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.fund.FundOption;
import org.project.neighfund.domain.member.Member;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Participation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fund_id", nullable = false)
    private Fund fund;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fund_option_id", nullable = false)
    private FundOption fundOption;   //리워드

    @Column(nullable = false)
    private Integer quantity;    //수량

    @Column(nullable = false)
    private Long paidAmount;   //결제가격

}
