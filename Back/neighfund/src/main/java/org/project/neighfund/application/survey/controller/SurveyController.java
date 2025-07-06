package org.project.neighfund.application.survey.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.survey.dto.SurveyDto;
import org.project.neighfund.application.survey.dto.SurveyResponseDto;
import org.project.neighfund.application.survey.dto.SurveyUserResponseDto;
import org.project.neighfund.application.survey.service.SurveyService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/survey")
public class SurveyController {

    private final SurveyService surveyService;

    //설문생성
    @PostMapping("/admin/write")
    public ResponseEntity<String> createPost(
            @RequestBody SurveyDto surveyDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ){
        Member loginUser = userDetails.getMember();
        surveyService.createPost(surveyDto, loginUser);
        return ResponseEntity.ok("설문이 작성되었습니다");
    }

    //설문삭제
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<String> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        Member loginUser = userDetails.getMember();
        surveyService.deletePost(id, loginUser);
        return ResponseEntity.ok("설문이 삭제되었습니다");
    }

    //설문상태변경
    @PutMapping("/admin/status/{id}")
    public ResponseEntity<String> statusPost(
            @PathVariable Long id,
            @RequestParam boolean visible,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        Member loginUser = userDetails.getMember();
        surveyService.statusPost(id, visible, loginUser);
        return ResponseEntity.ok("상태가 변경되었습니다");
    }

    //설문목록 + 총참여자수
    @GetMapping("/admin/view")
    public ResponseEntity<List<SurveyResponseDto>> viewAll(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        Member loginUser = userDetails.getMember();
        List<SurveyResponseDto> posts = surveyService.viewAll(loginUser);
        return ResponseEntity.ok(posts);
    }

    //설문보기
    @GetMapping("/view")
    public ResponseEntity<List<SurveyUserResponseDto>> viewPost(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        Member user = (userDetails != null) ? userDetails.getMember() : null;
        List<SurveyUserResponseDto> posts = surveyService.viewPost(user);
        return ResponseEntity.ok(posts);
    }

    //투표하기
    @PostMapping("/{surveyId}/vote")
    public ResponseEntity<String> votePost(
            @PathVariable Long surveyId,
            @RequestParam Long optionId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        Member loginUser = userDetails.getMember();
        surveyService.votePost(surveyId, optionId, loginUser);
        return ResponseEntity.ok("투표 완료");
    }






}
