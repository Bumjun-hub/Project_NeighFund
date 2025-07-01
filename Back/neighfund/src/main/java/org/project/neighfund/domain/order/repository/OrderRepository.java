package org.project.neighfund.domain.order.repository;

import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.order.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    boolean existsByFundAndMember(Fund fund, Member loginUser);
}
