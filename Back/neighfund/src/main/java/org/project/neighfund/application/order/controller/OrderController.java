package org.project.neighfund.application.order.controller;

import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.project.neighfund.application.order.dto.OrderDto;
import org.project.neighfund.application.order.service.OrderService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    
    @PostMapping("/{optionId}")
    public ResponseEntity<String> createOrder(
            @PathVariable Long optionId,
            @PathVariable Long fundId,
            @RequestBody OrderDto orderDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ){
        Member loginUser = userDetails.getMember();
        orderService.createOrder(optionId, fundId, orderDto, loginUser);
        return  ResponseEntity.ok("주문(참여)이 완료되었습니다.");
    }

}
