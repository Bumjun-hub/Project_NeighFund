package org.project.neighfund.application.vendorGathering.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.vendorGathering.dto.ReservationDto;
import org.project.neighfund.application.vendorGathering.dto.ReservationResponseDto;
import org.project.neighfund.application.vendorGathering.service.ReservationService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.OrderStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/gatherings/vendor")
public class ReservationController {

    private final ReservationService reservationService;

    //신청하기
    @PostMapping("/reservation/{vendorGatheringId}")
    public ResponseEntity<String> createReservation(
            @PathVariable Long vendorGatheringId,
            @RequestBody ReservationDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ){
        Member loginUSer = userDetails.getMember();
        reservationService.createReservation(vendorGatheringId, dto, loginUSer);
        return ResponseEntity.ok("원데이클래스가 예약되었습니다.");
    }

    //신청취소
    @DeleteMapping("/delete/{reservationId}")
    public ResponseEntity<String> deleteReservation(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        Member loginUSer = userDetails.getMember();
        reservationService.deleteReservation(reservationId, loginUSer);
        return ResponseEntity.ok("예약이 취소되었습니다");
    }

    //신청보기(마이페이지)
    @GetMapping("/myPage/reservation")
    public ResponseEntity<List<ReservationResponseDto>> viewReservation(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        Member loginUSer = userDetails.getMember();
        List<ReservationResponseDto> reservations = reservationService.viewReservation(loginUSer);
        return ResponseEntity.ok(reservations);
    }

    //입금상태변경(관리자)
    @PutMapping("/admin/{reservationId}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long reservationId,
            @RequestParam OrderStatus status
    ){
        reservationService.updateStatus(reservationId, status);
        return ResponseEntity.ok("주문상태가 변경되었습니다.");
    }





}
