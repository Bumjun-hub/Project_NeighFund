package org.project.neighfund.application.Participation.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.Participation.dto.ParticipationDto;
import org.project.neighfund.application.Participation.service.ParticipationService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/fund")
public class ParticipationController {

    private final ParticipationService participationService;

    @PostMapping("/{id}/apply")
    public ResponseEntity<String> apply(
            @PathVariable("id") Long fundId,
            @RequestBody ParticipationDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ) {
        Member loginUser = userDetails.getMember();

        participationService.apply(fundId, dto.getOptionId(),
                                        dto.getQuantity(), loginUser);
        return ResponseEntity.status(HttpStatus.CREATED).body("신청완료");
    }

    //신청취소

    //신청한 사람 리스트 확인(관리자)

    //내 신청목록보기(사용자)


}
