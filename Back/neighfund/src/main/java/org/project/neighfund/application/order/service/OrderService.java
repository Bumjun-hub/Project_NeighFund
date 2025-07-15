package org.project.neighfund.application.order.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.order.dto.OrderDto;
import org.project.neighfund.application.order.dto.OrderResponseDto;
import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.fund.FundOption;
import org.project.neighfund.domain.fund.FundOptionRepository;
import org.project.neighfund.domain.fund.FundRepository;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.order.Order;
import org.project.neighfund.domain.order.OrderRepository;
import org.project.neighfund.enums.FundStatus;
import org.project.neighfund.enums.OrderStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final FundRepository fundRepository;
    private final FundOptionRepository fundOptionRepository;

    //신청(구매)
    @Transactional
    public void createOrder(Long optionId, OrderDto orderDto, Member loginUser) {
        validateLogin(loginUser);
        FundOption option = validateOption(optionId);
        Fund originalFund = option.getFund();
        Fund fund = fundRepository.findById(originalFund.getId())
                .orElseThrow(() -> new IllegalArgumentException("펀드가 존재하지 않습니다."));

        if (fund.getFundStatus() == FundStatus.CLOSED) {
            throw new IllegalArgumentException("마감된 펀드 입니다");
        }

        if (orderRepository.existsByFundOptionAndMember(option, loginUser)) {
            throw new IllegalArgumentException("이미 신청한 펀드 입니다");
        }

        int quantity = orderDto.getQuantity();
        if (option.getQuantity() < quantity) {
            throw new IllegalArgumentException("남은 수량이 없습니다");
        }
        option.setQuantity(option.getQuantity() - quantity);

        long amount = option.getPrice() * quantity;

        // ✅ 1. 참여자 여부 먼저 체크하고 증가
        boolean alreadyParticipated = orderRepository
                .existsByMemberAndFundOption_FundAndStatus(loginUser, fund, OrderStatus.PENDING);
        if (!alreadyParticipated) {
            fund.setCurrentParticipants(fund.getCurrentParticipants() + 1);
        }

        // ✅ 2. 모인금액, 달성률 계산
        fund.setCurrentAmount(fund.getCurrentAmount() + amount);
        int progress = (int) Math.round(
                (double) fund.getCurrentAmount() * 100 / fund.getTargetAmount());
        fund.setProgressRate(progress);

        // ✅ 3. 주문 생성 및 저장
        Order order = Order.builder()
                .fundOption(option)
                .member(loginUser)
                .quantity(quantity)
                .totalAmount(amount)
                .address(orderDto.getAddress())
                .phone(orderDto.getPhone())
                .paymentName(orderDto.getPaymentName())
                .paymentBank(orderDto.getPaymentBank())
                .accountHolderName("neighFund")
                .virtualAccount("1234-5678-9012")
                .bankName("TestBank")
                .status(OrderStatus.PENDING)
                .build();
        orderRepository.save(order);

        // ✅ 4. 최종 펀드 반영
        fundRepository.save(fund);
        System.out.println("현재 참여자 수: " + fund.getCurrentParticipants());
    }


    //주문취소
    @Transactional
    public void cancelOrder(Long orderId, Member loginUser) {
        Order order = validateOrder(orderId);
        //본인확인
        if (!order.getMember().getId().equals(loginUser.getId())) {
            throw new AccessDeniedException("본인의 주문만 취소할 수 있습니다");
        }
        //이미취소되었는지
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("이미 취소된 주문입니다");
        }
        //마감일이후엔안됨
        Fund fund = order.getFundOption().getFund();
        if (fund.getDeadline().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("마감일 이후에는 취소할 수 없습니다");
        }

        //주문취소 삭제X 상태변경
        order.setStatus(OrderStatus.CANCELLED);
        order.setCanceledAt(LocalDateTime.now());

        //수량복원
        FundOption option = order.getFundOption();
        option.setQuantity(option.getQuantity() + order.getQuantity());

        //참여자, 모금액 되돌리기
        fund.setCurrentParticipants(fund.getCurrentParticipants() - 1);
        fund.setCurrentAmount(fund.getCurrentAmount() - order.getTotalAmount());

        //달성률
        int progress = (int) Math.round(
                (double) fund.getCurrentAmount() * 100 / fund.getTargetAmount());
        fund.setProgressRate(progress); // ⭐ 100% 제한 제거

    }

    //신청자보기(관리자)
    @Transactional
    public List<OrderResponseDto> getOrders(Long fundId, Long optionId, OrderStatus status) {
        Fund fund = validatePost(fundId);  //해당펀드가 있는지
        FundOption option = validateOption(optionId); //펀드랑 옵션 매핑

        List<Order> orders = (status == null)
                ? orderRepository.findByFundOption(option)
                : orderRepository.findByFundOptionAndStatus(option, status);

        return orders.stream().map(order -> OrderResponseDto.builder()
                        .id(order.getId())
                        .fundId(fund.getId())
                        .fundTitle(fund.getTitle())
                        .optionId(order.getFundOption().getId())
                        .optionTitle(order.getFundOption().getTitle())
                        .username(order.getMember().getUsername())
                        .quantity(order.getQuantity())
                        .totalAmount(order.getTotalAmount())
                        .address(order.getAddress())
                        .phone(order.getPhone())
                        .paymentName(order.getPaymentName())
                        .paymentBank(order.getPaymentBank())
                        .status(order.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    //주문단건조회 - 관리자
    @Transactional
    public OrderResponseDto detailOrders(Long orderId) {
        Order order = validateOrder(orderId);
        Fund fund = order.getFundOption().getFund();

        return OrderResponseDto.builder()
                .id(order.getId())
                .fundId(fund.getId())
                .fundTitle(fund.getTitle())
                .optionId(order.getFundOption().getId())
                .optionTitle(order.getFundOption().getTitle())
                .username(order.getMember().getUsername())
                .quantity(order.getQuantity())
                .totalAmount(order.getTotalAmount())
                .address(order.getAddress())
                .phone(order.getPhone())
                .paymentName(order.getPaymentName())
                .paymentBank(order.getPaymentBank())
                .status(order.getStatus())
                .build();
    }

    //내 주문 목록 조회 - 사용자
    @Transactional
    public List<OrderResponseDto> getMyOrder(Member loginUser) {
        List<Order> orders = orderRepository.findByMember(loginUser);

        return orders.stream().map(order -> {
                    Fund fund = order.getFundOption().getFund();
                    String fundImage = (fund.getFundImages() != null && !fund.getFundImages().isEmpty())
                            ? fund.getFundImages().get(0).getImgUrl()
                            :null;
                    return OrderResponseDto.builder()
                            .id(order.getId())
                            .fundId(fund.getId())
                            .fundTitle(fund.getTitle())
                            .optionId(order.getFundOption().getId())
                            .optionTitle(order.getFundOption().getTitle())
                            .username(order.getMember().getUsername())
                            .quantity(order.getQuantity())
                            .totalAmount(order.getTotalAmount())
                            .address(order.getAddress())
                            .phone(order.getPhone())
                            .paymentName(order.getPaymentName())
                            .paymentBank(order.getPaymentBank())
                            .status(order.getStatus())
                            .fundImage(fundImage) // 대표 이미지
                            .locationName(fund.getLocationName()) // 동네
                            .subTitle(fund.getSubTitle())         // 소제목
                            .progressRate(fund.getProgressRate()) // 달성률
                            .build();
                })
                .collect(Collectors.toList());
    }

    // 내 주문 목록 상세조회 - 사용자
    @Transactional
    public OrderResponseDto detailMyOrder(Long orderId, Member loginUser) {
        Order order = validateOrder(orderId);
        if (!order.getMember().getId().equals(loginUser.getId())) {
            throw new AccessDeniedException("본인의 주문만 조회할 수 있습니다");
        }

        Fund fund = order.getFundOption().getFund();

        return OrderResponseDto.builder()
                .id(order.getId())
                .fundId(fund.getId())
                .fundTitle(fund.getTitle())
                .optionId(order.getFundOption().getId())
                .optionTitle(order.getFundOption().getTitle())
                .username(order.getMember().getUsername())
                .quantity(order.getQuantity())
                .totalAmount(order.getTotalAmount())
                .address(order.getAddress())
                .phone(order.getPhone())
                .paymentName(order.getPaymentName())
                .paymentBank(order.getPaymentBank())
                .status(order.getStatus())
                .build();
    }

    // 주문수량변경
    public void updateQuantity(Long orderId, int newQuantity, Member loginUser) {
        Order order = validateOrder(orderId);
        if (!order.getMember().equals(loginUser))
            throw new AccessDeniedException("본인의 주문만 수정할 수 있습니다");

        if (order.getStatus() != OrderStatus.PENDING)
            throw new IllegalArgumentException("입금완료 후에는 수정할 수 없습니다");

        int diff = newQuantity - order.getQuantity();
        FundOption opt = order.getFundOption();

        //수량 증가시 재고 확인
        if (diff > 0 && opt.getQuantity() < diff)
            throw new IllegalArgumentException("재고가 부족합니다");

        // 재고 보정
        opt.setQuantity(opt.getQuantity() - diff);

        //금액,펀드 집계 보정
        long newAmount = (long) newQuantity * opt.getPrice();
        long delta = newAmount - order.getTotalAmount();

        Fund fund = opt.getFund();
        fund.setCurrentAmount(fund.getCurrentAmount() + delta);
        int progress = (int) Math.round(
                (double) fund.getCurrentAmount() * 100 / fund.getTargetAmount());
        fund.setProgressRate(progress);

        //주문 업데이트
        order.setQuantity(newQuantity);
        order.setTotalAmount(newAmount);
    }


    //주문상태 변경 - 관리자
    @Transactional
    public void updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다"));
        order.setStatus(status);
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
    private FundOption validateOption(Long optionId) {
        FundOption option = fundOptionRepository.findById(optionId)
                .orElseThrow(() -> new IllegalArgumentException("해당 옵션이 없습니다"));
        Fund fund = option.getFund();
        if (fund == null) {
            throw new IllegalArgumentException("옵션이 펀드와 일치하지 않습니다. ");
        }
        return option;
    }

    //주문존재확인
    private Order validateOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다"));
    }


    @Transactional
    public List<OrderResponseDto> getOrdersByOption(Long optionId, OrderStatus status) {
        FundOption option = validateOption(optionId); // 옵션 존재 여부 및 펀드 연결 검증

        List<Order> orders = (status == null)
                ? orderRepository.findByFundOption(option)
                : orderRepository.findByFundOptionAndStatus(option, status);

        return orders.stream().map(order -> {
            Fund fund = order.getFundOption().getFund();
            return OrderResponseDto.builder()
                    .id(order.getId())
                    .fundId(fund.getId())
                    .fundTitle(fund.getTitle())
                    .optionId(option.getId())
                    .optionTitle(order.getFundOption().getTitle())
                    .username(order.getMember().getUsername())
                    .quantity(order.getQuantity())
                    .totalAmount(order.getTotalAmount())
                    .address(order.getAddress())
                    .phone(order.getPhone())
                    .paymentName(order.getPaymentName())
                    .paymentBank(order.getPaymentBank())
                    .status(order.getStatus())
                    .build();
        }).collect(Collectors.toList());
    }

    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> {
                    Fund fund = order.getFundOption().getFund();
                    return OrderResponseDto.builder()
                            .id(order.getId())
                            .fundId(fund.getId())
                            .fundTitle(fund.getTitle())
                            .optionId(order.getFundOption().getId())
                            .optionTitle(order.getFundOption().getTitle())
                            .username(order.getMember().getUsername())
                            .quantity(order.getQuantity())
                            .totalAmount(order.getTotalAmount())
                            .address(order.getAddress())
                            .phone(order.getPhone())
                            .paymentName(order.getPaymentName())
                            .paymentBank(order.getPaymentBank())
                            .status(order.getStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }


    private OrderResponseDto toResponseDto(Order order) {
        FundOption option = order.getFundOption();

        return OrderResponseDto.builder()
                .id(order.getId())
                .fundId(option.getFund().getId())
                .fundTitle(option.getFund().getTitle())
                .optionId(option.getId())
                .optionTitle(option.getTitle())
                .optionPrice(option.getPrice())
                .username(order.getMember().getUsername())
                .quantity(order.getQuantity())
                .totalAmount(order.getTotalAmount())
                .address(order.getAddress())
                .phone(order.getPhone())
                .paymentName(order.getPaymentName())
                .paymentBank(order.getPaymentBank())
                .status(order.getStatus())
                .build();
    }


    public List<OrderResponseDto> getOrdersByFundId(Long fundId) {
        List<Order> orders = orderRepository.findByFundOption_Fund_Id(fundId);
        return orders.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }



}
