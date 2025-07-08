package org.project.neighfund.application.vendorGathering.service;

import jakarta.persistence.Id;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.vendorGathering.dto.ReservationAdminResponseDto;
import org.project.neighfund.application.vendorGathering.dto.ReservationDto;
import org.project.neighfund.application.vendorGathering.dto.ReservationResponseDto;
import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.vendorGathering.*;
import org.project.neighfund.enums.OrderStatus;
import org.project.neighfund.enums.RoleName;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationSlotRepository reservationSlotRepository;
    private final ReservationRepository reservationRepository;
    private final VendorGatheringRepository vendorGatheringRepository;

    //신청 / slot생성
    @Transactional
    public Long createReservation(Long vendorGatheringId, ReservationDto dto, Member loginUSer) {
        validateLogin(loginUSer);
        VendorGathering vendorGathering = validatePost(vendorGatheringId);

        //slot만들거나 생성
        ReservationSlot slot = findOrCreateSlot(vendorGathering, dto.getDate(), dto.getStartTime(), dto.getEndTime());

        //정원초과인지 검사
        if (slot.getCurrentParticipants() + dto.getParticipantCount() > slot.getMaxParticipants()) {
            throw new IllegalArgumentException("예약 가능 인원을 초과했습니다");
        }

        //참가인원증가
        slot.setCurrentParticipants(slot.getCurrentParticipants() + dto.getParticipantCount());

        //저장
        Reservation reservation = reservationRepository.save(
                Reservation.builder()
                        .member(loginUSer)
                        .reservationSlot(slot)
                        .participantCount(dto.getParticipantCount())
                        .paymentBank(dto.getPaymentBank())
                        .paymentName(dto.getPaymentName())
                        .status(OrderStatus.PENDING)
                        .build());
        return reservation.getId();
    }

    //예약취소
    @Transactional
    public void deleteReservation(Long reservationId, Member loginUSer) {
        validateLogin(loginUSer);
        //예약조회
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약이 존재하지 않습니다"));
        //예약자본인확인
        if (!reservation.getMember().getId().equals(loginUSer.getId())) {
            throw new IllegalArgumentException("본인의 예약만 취소할 수 있습니다.");
        }
        //이미취소됬는지
        if (reservation.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("이미 취소된 예약입니다");
        }
        reservation.setStatus(OrderStatus.CANCELLED);

        //인원복구
        ReservationSlot slot = reservation.getReservationSlot();
        slot.setCurrentParticipants(
                slot.getCurrentParticipants() - reservation.getParticipantCount()
        );
    }

    //마이페이지에서 조회
    @Transactional
    public List<ReservationResponseDto> viewReservation(Member loginUser) {
        validateLogin(loginUser);

        List<Reservation> reservationList = reservationRepository.findByMember(loginUser);

        return reservationList.stream()
                .map(reservation -> ReservationResponseDto.builder()
                        .classTitle(reservation.getReservationSlot().getVendorGathering().getTitle())
                        .date(reservation.getReservationSlot().getStartTime().toLocalDate())
                        .startTime(reservation.getReservationSlot().getStartTime().toLocalTime())
                        .endTime(reservation.getReservationSlot().getEndTime().toLocalTime())
                        .participantCount(reservation.getParticipantCount())
                        .paymentBank(reservation.getPaymentBank())
                        .paymentName(reservation.getPaymentName())
                        .status(reservation.getStatus())
                        .build())
                .toList();
    }

    //신청목록보기(관리자)
    public List<ReservationAdminResponseDto> adminView(Member loginUser) {
        validateAdmin(loginUser);

        List<Reservation> reservationList = reservationRepository.findAll();

        return reservationList.stream()
                .map(reservation -> ReservationAdminResponseDto.builder()
                        .reservationId(reservation.getId())
                        .classTitle(reservation.getReservationSlot().getVendorGathering().getTitle())
                        .date(reservation.getReservationSlot().getStartTime().toLocalDate())
                        .startTime(reservation.getReservationSlot().getStartTime().toLocalTime())
                        .participantCount(reservation.getParticipantCount())
                        .paymentBank(reservation.getPaymentBank())
                        .paymentName(reservation.getPaymentName())
                        .status(reservation.getStatus())
                        .build())
                .toList();
    }

    //입금상태변경
    @Transactional
    public void updateStatus(Long reservationId, OrderStatus status, Member loginUser) {
        validateAdmin(loginUser);
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("해당 예약이 없습니다."));
        reservation.setStatus(status);

    }



    //공통메서드
    //로그인여부
    public void validateLogin(Member member) {
        if (member == null) {
            throw new IllegalArgumentException("로그인이 필요한 기능입니다.");
        }
    }

    //관리자용
    //관리자확인
    public void validateAdmin(Member loginUser) {
        if (loginUser == null) {
            throw new AccessDeniedException("로그인이 필요합니다");
        }
        if (loginUser.getRole().getName() != RoleName.ROLE_ADMIN) {
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        }
    }

    //해당원데이클래스존재여부
    public VendorGathering validatePost(Long vendorGatheringId) {
        return vendorGatheringRepository.findById(vendorGatheringId)
                .orElseThrow(() -> new IllegalArgumentException("해당펀드가 없습니다"));
    }

    //slot만들거나 생성
    private ReservationSlot findOrCreateSlot(VendorGathering gathering, LocalDate date, LocalTime  start, LocalTime end) {
        LocalDateTime startTime = LocalDateTime.of(date, start);
        LocalDateTime endTime = LocalDateTime.of(date, end);

        return reservationSlotRepository.findByVendorGatheringAndStartTime(gathering, startTime)
                .orElseGet(() -> reservationSlotRepository.save(
                        ReservationSlot.builder()
                                .vendorGathering(gathering)
                                .startTime(startTime)
                                .endTime(endTime)
                                .maxParticipants(gathering.getMaxParticipants())
                                .currentParticipants(0)
                                .build()
                ));
    }



}
