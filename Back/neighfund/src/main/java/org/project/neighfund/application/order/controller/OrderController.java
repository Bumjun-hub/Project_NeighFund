package org.project.neighfund.application.order.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.order.dto.OrderDto;
import org.project.neighfund.application.order.dto.OrderResponseDto;
import org.project.neighfund.application.order.service.OrderService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.OrderStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    //1. 주문하기
    @PostMapping("/{optionId}")
    public ResponseEntity<String> createOrder(
            @PathVariable Long optionId,
            @RequestBody OrderDto orderDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ){
        Member loginUser = userDetails.getMember();
        orderService.createOrder(optionId, orderDto, loginUser);
        return  ResponseEntity.ok("주문(참여)이 완료되었습니다.");
    }

    //2. 주문취소
    @DeleteMapping("/{orderId}")
    public ResponseEntity<String> cancelOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
      Member loginUser = userDetails.getMember();
      orderService.cancelOrder(orderId, loginUser);
      return ResponseEntity.ok("주문(참여)이 취소되었습니다.");
    }

    //3. 전체 주문(참여자)조회 - 관리자
    @GetMapping("/admin/{optionId}/order")
    public ResponseEntity<List<OrderResponseDto>> getOrders(
            @PathVariable Long fundId,
            @PathVariable Long optionId,
            @RequestParam(required = false)OrderStatus status
            ){
        List<OrderResponseDto> orderList = orderService.getOrders(fundId,optionId, status);
        return ResponseEntity.ok(orderList);
    }

    //4. 단일주문상세조회 - 관리자
    @GetMapping("/admin/order/{orderId}")
    public ResponseEntity<OrderResponseDto> detailOrders(
            @PathVariable Long orderId
    ){
        OrderResponseDto dto = orderService.detailOrders(orderId);
        return ResponseEntity.ok(dto);
    }

    //5. 내 주문 내역 전체 조회
    @GetMapping("/myPage/order")
    public ResponseEntity<List<OrderResponseDto>> getMyOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        Member loginUser = userDetails.getMember();
        List<OrderResponseDto> orders = orderService.getMyOrder(loginUser);
        return ResponseEntity.ok(orders);
    }

    //6. 내 주문 내역 상세 조회
    @GetMapping("/myPage/order/{orderId}")
    public  ResponseEntity<OrderResponseDto> detailMyOrders(
            @PathVariable Long orderId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        Member loginUser = userDetails.getMember();
        OrderResponseDto dto = orderService.detailMyOrder(orderId, loginUser);
        return ResponseEntity.ok(dto);
    }

    //7. 주문 수량 변경
    @PutMapping("/myPage/order/{orderId}/quantity")
    public ResponseEntity<String> updateQuantity(
            @PathVariable Long orderId,
            @RequestParam int newQuantity,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        Member loginUser = userDetails.getMember();
        orderService.updateQuantity(orderId, newQuantity, loginUser);
        return ResponseEntity.ok("수량이 변경되었습니다");
    }

    //8. 주문상태 변경 - 관리자
    @PutMapping("/admin/{orderId}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ){
        orderService.updateStatus(orderId, status);
        return ResponseEntity.ok("주문상태가 변경되었습니다.");
    }

}
