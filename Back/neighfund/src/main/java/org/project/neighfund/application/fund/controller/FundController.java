package org.project.neighfund.application.fund.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.fund.dto.FundDto;
import org.project.neighfund.application.fund.dto.FundListDto;
import org.project.neighfund.application.fund.dto.FundOptionDto;
import org.project.neighfund.application.fund.dto.FundResponseDto;
import org.project.neighfund.application.fund.service.FundService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.CommunityCategory;
import org.project.neighfund.enums.FundStatus;
import org.project.neighfund.enums.FundType;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/fund")
public class FundController {

    private final FundService fundService;

    //작성
    // 수정된 부분: createPost(), editPost() 메서드 구조 변경
    @PostMapping(value = "write", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createPost(
            @RequestPart("fundDto") FundDto fundDto, // ✅ 하나로 받음
            @RequestPart(value = "mainImage", required = false) MultipartFile imageFile,
            @RequestPart(value = "contentImages", required = false) List<MultipartFile> contentImages,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Member loginUser = userDetails.getMember();
        fundService.createPost(
                fundDto,
                imageFile != null ? List.of(imageFile) : List.of(),
                contentImages != null ? contentImages : List.of(),
                loginUser
        );
        return ResponseEntity.status(HttpStatus.CREATED).body("게시글이 작성되었습니다.");
    }

    @PutMapping(value = "edit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> editPost(
            @PathVariable Long id,
            @RequestPart("fundDto") FundDto fundDto, // ✅ 동일하게 하나로 받음
            @RequestPart(value = "mainImage", required = false) MultipartFile imageFile,
            @RequestPart(value = "contentImages", required = false) List<MultipartFile> contentImages,
            @RequestParam(value = "deleteImageIds", required = false) List<Long> deleteImageIds,
            @RequestParam(value = "deleteContentImageIds", required = false) List<Long> deleteContentImageIds,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Member loginUser = userDetails.getMember();
        fundService.editPost(
                id,
                fundDto,
                imageFile != null ? List.of(imageFile) : List.of(),
                contentImages != null ? contentImages : List.of(),
                deleteImageIds,
                deleteContentImageIds,
                loginUser
        );
        return ResponseEntity.ok("게시글이 수정되었습니다.");
    }

    //삭제
    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Member loginUser = userDetails.getMember();
        fundService.deletePost(id, loginUser);
        return ResponseEntity.ok("게시글이 삭제되었습니다.");
    }

    //조회
    @GetMapping("/view")
    public ResponseEntity<List<FundListDto>> viewAll(
            @RequestParam(required = false) CommunityCategory category,
            @RequestParam(required = false) FundStatus status,
            @RequestParam(required = false) FundType type
    ) {
        List<FundListDto> posts = fundService.viewAll(category, status, type);
        return ResponseEntity.ok(posts);
    }

    //상세조회
    @GetMapping("/view/{id}")
    public ResponseEntity<FundResponseDto> detailView(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Member loginUser = userDetails.getMember();
        FundResponseDto posts = fundService.detailView(id, loginUser);
        return ResponseEntity.ok(posts);
    }

    //관리자 검수 상태 변경
    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<String> approveFund(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Member loginUser = userDetails.getMember();
        fundService.approveFund(id, loginUser);
        return ResponseEntity.ok("펀딩이 승인되었습니다.");
    }


}
