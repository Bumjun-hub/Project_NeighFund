package org.project.neighfund.domain.order;

import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.fund.FundOption;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    boolean existsByFundOptionAndMember(FundOption fundOption, Member loginUser);

    List<Order> findByFundOption(FundOption option);

    List<Order> findByFundOptionAndStatus(FundOption option, OrderStatus status);

    List<Order> findByMember(Member loginUser);
}
