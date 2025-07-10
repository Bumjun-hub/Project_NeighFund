package org.project.neighfund.domain.order;

import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.fund.FundOption;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    boolean existsByFundOptionAndMember(FundOption fundOption, Member loginUser);

    boolean existsByMemberAndFundOption_Fund(Member member, Fund fund); // 중복 참여 여부

    boolean existsByMemberAndFundOption_FundAndStatus(Member member, Fund fund, OrderStatus status);



    List<Order> findByFundOption(FundOption option);

    List<Order> findByFundOptionAndStatus(FundOption option, OrderStatus status);

    List<Order> findByMember(Member loginUser);


    List<Order> findByFundOption_Fund_Id(Long fundId);
}
