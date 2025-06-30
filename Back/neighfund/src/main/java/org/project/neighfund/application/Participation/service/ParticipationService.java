package org.project.neighfund.application.Participation.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.fund.FundOption;
import org.project.neighfund.domain.fund.FundOptionRepository;
import org.project.neighfund.domain.fund.FundRepository;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.participation.Participation;
import org.project.neighfund.domain.participation.ParticipationRepository;
import org.project.neighfund.enums.FundStatus;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ParticipationService {

    private final ParticipationRepository participationRepository;
    private final FundRepository fundRepository;
    private final FundOptionRepository fundOptionRepository;

    //신청
    @Transactional
    public void apply(Long fundId, Long optionId, Integer quantity, Member loginUser) {
        validateLogin(loginUser);   //로그인여부
        validateRequest(optionId, quantity);// 작성여부
        Fund fund = validatePost(fundId);  //해당펀드존재여부
        FundOption option = validateOption(optionId, fund); //펀드랑 옵션 매핑

        //마감변환(날짜기준)
        if (fund.getDeadline().isBefore(LocalDateTime.now()) &&
                fund.getFundStatus() == FundStatus.ONGOING) {
            fund.setFundStatus(FundStatus.CLOSED);
        }

        // 상태 마감 -> 신청불가
        if (fund.getFundStatus() == FundStatus.CLOSED) {
            throw new IllegalArgumentException("마감된 펀드 입니다");
        }

        //중복신청여부
        if (participationRepository.existsByFundAndMember(fund, loginUser)) {
            throw new IllegalArgumentException("이미 신청한 펀드 입니다");
        }

        //수량
        if (option.getQuantity() < quantity) {
            throw new IllegalArgumentException("남은 수량이 없습니다");
        }
        option.setQuantity((option.getQuantity() - quantity));

        long paid = option.getPrice() * quantity;
        Participation participation = Participation.builder()
                .fund(fund)
                .member(loginUser)
                .fundOption(option)
                .quantity(quantity)
                .paidAmount(paid)
                .build();
        Participation saved = participationRepository.save(participation);

        //구매하면 참여자 +1
        fund.setCurrentParticipants(fund.getCurrentParticipants() + 1);
        //현재모인금액
        fund.setCurrentAmount(fund.getCurrentAmount() + saved.getPaidAmount());
        //달성률 계산
    }




    //해당펀드존재여부
    public Fund validatePost(Long fundId) {
        return fundRepository.findById(fundId)
                .orElseThrow(() -> new IllegalArgumentException("해당펀드가 없습니다"));
    }

    //로그인여부
    public void validateLogin(Member member) {
        if (member == null) {
            throw new IllegalArgumentException("로그인이 필요한 기능입니다.");
        }
    }

    //옵션, 수량 검증
    private void validateRequest(Long optionId, Integer quantity ) {
        if (optionId == null) {
            throw new IllegalArgumentException("옵션을 선택해 주세요");
        }
        if (quantity == null) {
            throw new IllegalArgumentException("수량을 선택해 주세요");
        }
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
