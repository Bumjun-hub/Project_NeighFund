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
    @PostMapping(value = "write", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createPost(
            @RequestPart("category") String category,
            @RequestPart("fundType") String fundType,
            @RequestPart("fundStatus") String fundStatus,
            @RequestPart("title") String title,
            @RequestPart("subTitle") String subTitle,
            @RequestPart("content") String content,
            @RequestPart("targetAmount") Integer targetAmount,
            @RequestPart("deadline")@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime deadline,
            @RequestPart("hashTags") String hashTags,
            @RequestPart(value = "options", required = false) List<FundOptionDto> options,
            @RequestPart(value = "images", required = false) MultipartFile imageFile,
            @RequestPart(value = "contentImage", required = false) MultipartFile contentImage,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ){

        FundDto fundDto = FundDto.builder()
                .category(CommunityCategory.valueOf(category))
                .fundType(FundType.valueOf(fundType))
                .fundStatus(FundStatus.ONGOING)
                .title(title)
                .subTitle(subTitle)
                .content(content)
                .targetAmount(targetAmount)
                .deadline(deadline)
                .hashTags(hashTags)
                .options(options)
                .build();
        Member loginUser = userDetails.getMember();

        List<MultipartFile> imageFiles = imageFile != null ? List.of(imageFile) : List.of();
        List<MultipartFile> contentImages = contentImage != null ? List.of(contentImage) : List.of();

        fundService.createPost(fundDto, imageFiles, contentImages, loginUser);
        return ResponseEntity.status(HttpStatus.CREATED).body("게시글이 작성되었습니다.");
    }

    //수정
    @PutMapping(value = "edit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> editPost(
            @PathVariable Long id,
            @RequestPart("category") String category,
            @RequestPart("fundType") String fundType,
            @RequestPart("fundStatus") String fundStatus,
            @RequestPart("title") String title,
            @RequestPart("subTitle") String subTitle,
            @RequestPart("content") String content,
            @RequestPart("targetAmount") Integer targetAmount,
            @RequestPart("deadline")LocalDateTime deadline,
            @RequestPart("hashTags") String hashTags,
            @RequestPart(value = "options", required = false) List<FundOptionDto> options,
            @RequestPart(value = "images", required = false) List<MultipartFile> imageFiles,
            @RequestPart(value = "contentImage", required = false) List<MultipartFile> contentImages,
            @RequestParam(value = "deleteImageIds", required = false) List<Long> deleteImageIds,
            @RequestParam(value = "deleteContentImageIds", required = false) List<Long> deleteContentImageIds,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        FundDto fundDto = FundDto.builder()
                .category(CommunityCategory.valueOf(category))
                .fundType(FundType.valueOf(fundType))
                .fundStatus(FundStatus.ONGOING)
                .title(title)
                .subTitle(subTitle)
                .content(content)
                .targetAmount(targetAmount)
                .deadline(deadline)
                .hashTags(hashTags)
                .options(options)
                .build();
        Member loginUser = userDetails.getMember();

        fundService.editPost(id, fundDto, imageFiles, contentImages, deleteImageIds, deleteContentImageIds, loginUser);
        return ResponseEntity.ok("게시글이 수정되었습니다.");
    }

    //삭제
    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
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
    ){
        Member loginUser = userDetails.getMember();
        FundResponseDto posts = fundService.detailView(id, loginUser);
        return ResponseEntity.ok(posts);
    }

    //관리자 검수 상태 변경
    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<String> approveFund(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        Member loginUser = userDetails.getMember();
        fundService.approveFund(id, loginUser);
        return ResponseEntity.ok("펀딩이 승인되었습니다.");
    }






}
