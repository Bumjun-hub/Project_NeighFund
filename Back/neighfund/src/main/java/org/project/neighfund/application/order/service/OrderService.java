package org.project.neighfund.application.order.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.order.dto.OrderDto;
import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.fund.FundOption;
import org.project.neighfund.domain.fund.FundOptionRepository;
import org.project.neighfund.domain.fund.FundRepository;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;
import org.project.neighfund.domain.order.domain.Order;
import org.project.neighfund.domain.order.repository.OrderRepository;
import org.project.neighfund.enums.FundStatus;
import org.project.neighfund.enums.OrderStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final FundRepository fundRepository;
    private final FundOptionRepository fundOptionRepository;

    //신청(구매)
    @Transactional
    public void createOrder(Long optionId,Long fundId, OrderDto orderDto, Member loginUser) {
        validateLogin(loginUser);
        Fund fund = validatePost(fundId);
        FundOption option = validateOption(optionId, fund); //펀드랑 옵션 매핑

        // 상태 마감 -> 신청불가
        if (fund.getFundStatus() == FundStatus.CLOSED) {
            throw new IllegalArgumentException("마감된 펀드 입니다");
        }

        //중복신청여부
        if (orderRepository.existsByFundAndMember(fund, loginUser)) {
            throw new IllegalArgumentException("이미 신청한 펀드 입니다");
        }

        //수량
        int quantity = orderDto.getQuantity();
        if (option.getQuantity() < quantity) {
            throw new IllegalArgumentException("남은 수량이 없습니다");
        }
        //재고차감
        option.setQuantity((option.getQuantity() - quantity));

        //총가격
        long amount = option.getPrice() * quantity;

        //주문생성
        Order order = Order.builder()
                .fundOption(option)
                .member(loginUser)
                .quantity(quantity)
                .totalAmount(amount)
                .address(orderDto.getAddress())
                .phone(orderDto.getPhone())
                .paymentName(orderDto.getPaymentName())
                .paymentBank(orderDto.getPaymentBank())
                .status(OrderStatus.PENDING)
                .build();
        orderRepository.save(order);

        //참여자
        fund.setCurrentParticipants(fund.getCurrentParticipants() + 1);
        //모인금액
        fund.setCurrentAmount(fund.getCurrentAmount() + amount);
        //달성률
        int progress = (int) Math.round(
                (double) fund.getCurrentAmount() * 100 / fund.getTargetAmount());
        if (progress > 100) progress = 100;
        fund.setProgressRate(progress);
    }

    //로그인여부
    public void validateLogin(Member member) {
        if (member == null) {
            throw new IllegalArgumentException("로그인이 필요한 기능입니다.");
        }
    }

    //해당펀드존재여부
    public Fund validatePost(Long fundId) {
        return fundRepository.findById(fundId)
                .orElseThrow(() -> new IllegalArgumentException("해당펀드가 없습니다"));
    }

    //펀드 - 옵션 매핑
    private FundOption validateOption(Long optionId, Fund fund) {
        FundOption option = fundOptionRepository.findById(optionId)
                .orElseThrow(()-> new IllegalArgumentException("해당 옵션이 없습니다"));
        if (!option.getFund().equals(fund)) {
            throw new IllegalArgumentException("옵션이 펀드와 일치하지 않습니다. ");
        }
        return option;
    }


}
