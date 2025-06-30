package org.project.neighfund.application.Participation.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.Participation.dto.ParticipationDto;
import org.project.neighfund.application.Participation.dto.ParticipationResponseDto;
import org.project.neighfund.application.Participation.service.ParticipationService;
import org.project.neighfund.application.fund.dto.FundListDto;
import org.project.neighfund.application.fund.service.FundService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/fund")
public class ParticipationController {

    private final ParticipationService participationService;

    //신청하기
    @PostMapping("/{fundId}/apply")
    public ResponseEntity<String> apply(
            @PathVariable Long fundId,
            @RequestBody ParticipationDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ) {
        Member loginUser = userDetails.getMember();

        participationService.apply(fundId, dto.getOptionId(),
                                        dto.getQuantity(), loginUser);
        return ResponseEntity.status(HttpStatus.CREATED).body("신청완료");
    }

    //신청취소
    @DeleteMapping("/{fundId}/cancel")
    public ResponseEntity<String> cancelApply(
            @PathVariable Long fundId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        Member loginUser = userDetails.getMember();
        participationService.cancelApply(fundId, loginUser);
        return ResponseEntity.ok("신청이 취소되었습니다.");
    }

    //신청한 사람 리스트 확인(관리자)
    @GetMapping("admin/{fundId}/applyList")
    public ResponseEntity<List<ParticipationResponseDto>> applyList(
            @PathVariable Long fundId
    ){
        List<ParticipationResponseDto> applyList = participationService.applyList(fundId);
        return ResponseEntity.ok(applyList);
    }

    //내 신청목록보기(사용자)
    @GetMapping("/myPage/view")
    public ResponseEntity<List<FundListDto>> myFundsView(@AuthenticationPrincipal CustomUserDetails userDetails){
        Member loginUser = userDetails.getMember();
        List<FundListDto> list = participationService.myFundsView(loginUser);
        return ResponseEntity.ok(list);
    }




}
