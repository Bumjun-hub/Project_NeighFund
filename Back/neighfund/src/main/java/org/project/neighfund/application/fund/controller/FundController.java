package org.project.neighfund.application.fund.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.fund.dto.FundDto;
import org.project.neighfund.application.fund.dto.FundListDto;
import org.project.neighfund.application.fund.service.FundService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.CommunityCategory;
import org.project.neighfund.enums.FundImageType;
import org.project.neighfund.enums.FundStatus;
import org.project.neighfund.enums.FundType;
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
    @PostMapping(value = "admin/write", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createPost(
            @RequestPart("category") String category,
            @RequestPart("fundType") String fundType,
            @RequestPart("fundStatus") String fundStatus,
            @RequestPart("title") String title,
            @RequestPart("subTitle") String subTitle,
            @RequestPart("content") String content,
            @RequestPart("targetAmount") Integer targetAmount,
            @RequestPart("deadline")LocalDateTime deadline,
            @RequestPart(value = "imageType", required = false) List<FundImageType> imageTypes,
            @RequestPart(value = "images", required = false) List<MultipartFile> imageFiles,
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
                .build();
        Member loginUser = userDetails.getMember();

        fundService.createPost(fundDto, imageTypes, imageFiles, loginUser);
        return ResponseEntity.status(HttpStatus.CREATED).body("게시글이 작성되었습니다.");
    }

    //수정
    @PutMapping(value = "admin/edit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
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
            @RequestPart(value = "imageType", required = false) List<FundImageType> imageTypes,
            @RequestPart(value = "images", required = false) List<MultipartFile> imageFiles,
            @RequestParam(value = "deleteImageIds", required = false) List<Long> deleteImageIds,
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
                .build();
        Member loginUser = userDetails.getMember();

        fundService.editPost(id, fundDto, imageTypes, imageFiles, deleteImageIds, loginUser);
        return ResponseEntity.ok("게시글이 수정되었습니다.");
    }

    //삭제
    @DeleteMapping("/admin/delete/{id}")
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
            @RequestParam(required = false) FundStatus status
    ) {
        List<FundListDto> posts = fundService.viewAll();
        return ResponseEntity.ok(posts);
    }





}
