package org.project.neighfund.application.community.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.community.dto.CommunityDto;
import org.project.neighfund.application.community.dto.CommunityResponseDto;
import org.project.neighfund.application.community.dto.CommunityStatusDto;
import org.project.neighfund.application.community.service.CommunityService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.CommunityCategory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community")
public class CommunityController {

    private final CommunityService communityService;




    // CommunityController.java
    @GetMapping("/detail/{id}")
    public ResponseEntity<CommunityResponseDto> getOne(@PathVariable Long id) {
        CommunityResponseDto dto = communityService.getOne(id);
        return ResponseEntity.ok(dto);
    }

    //작성
    @PostMapping("/write")
    public ResponseEntity<String> createPost(@RequestBody CommunityDto communityDto,
                                             @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member loginUser = userDetails.getMember();
        communityService.createPost(communityDto, loginUser);
        return ResponseEntity.status(HttpStatus.CREATED).body("게시글이 등록되었습니다.");
    }

    //수정
    @PutMapping("/edit/{id}")
    public ResponseEntity<String> editPost(@PathVariable Long id,
                                           @RequestBody CommunityDto communityDto,
                                           @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member loginUser = userDetails.getMember();
        communityService.editPost(id, communityDto, loginUser);
        return ResponseEntity.ok("게시물이 수정되었습니다.");
    }

    //삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id,
                                             @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member loginUser = userDetails.getMember();
        communityService.deletePost(id, loginUser);
        return ResponseEntity.ok("게시물이 삭제되었습니다.");
    }

    // 전체 글 조회
    @GetMapping("/view")
    public ResponseEntity<List<CommunityResponseDto>> viewAll(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member loginUser = (userDetails != null) ? userDetails.getMember() : null;
        List<CommunityResponseDto> posts = communityService.viewAll(loginUser);
        return ResponseEntity.ok(posts);
    }


    //카테고리별조회
    @GetMapping("/view/{category}")
    public ResponseEntity<List<CommunityResponseDto>> viewPost(
            @PathVariable CommunityCategory category,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member loginUser = (userDetails != null) ? userDetails.getMember() : null;
        List<CommunityResponseDto> posts = communityService.viewPost(category, loginUser);
        return ResponseEntity.ok(posts);
    }

    //상태변환(관리자)
    @PutMapping("/admin/edit/{id}")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long id,
            @RequestBody CommunityStatusDto statusDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Member loginUser = userDetails.getMember();
        communityService.updateStatus(id, statusDto, loginUser);
        return ResponseEntity.ok("상태가 변경되었습니다.");
    }

    // 내가 쓴 제안글 조회 (마이페이지)
    @GetMapping("/myPosts")
    public ResponseEntity<List<CommunityResponseDto>> getMyPosts(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Member loginUser = userDetails.getMember();
        List<CommunityResponseDto> posts = communityService.findByAuthor(loginUser);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/myLiked")
    public ResponseEntity<List<CommunityResponseDto>> getMyLikedPosts(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member loginUser = userDetails.getMember();
        List<CommunityResponseDto> likedPosts = communityService.findLikedByMember(loginUser);
        return ResponseEntity.ok(likedPosts);
    }



}
