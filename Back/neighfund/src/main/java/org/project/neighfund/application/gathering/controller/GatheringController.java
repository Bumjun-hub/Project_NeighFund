package org.project.neighfund.application.gathering.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.gathering.dto.*;
import org.project.neighfund.application.gathering.service.GatheringService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.GatheringCategory;
import org.project.neighfund.enums.GatheringPostCategory;
import org.project.neighfund.enums.GatheringType;
import org.project.neighfund.global.dto.MessageResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/gatherings/free")
@RequiredArgsConstructor
public class GatheringController {
    private final GatheringService gatheringService;
    
    // 사용자 FREE 소모임 작성
    @PostMapping("/create")
    public ResponseEntity<GatheringCreateResponse> createGathering(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                   @RequestPart("title") String title,
                                                                   @RequestPart("category") String category,
                                                                   @RequestPart("type") String type,
                                                                   @RequestPart("dongName") String dongName,
                                                                   @RequestPart("content") String content,
                                                                   @RequestPart("introduction") String introduction,
                                                                   @RequestPart("nickname") String nickname,
                                                                   @RequestPart(value = "titleImage", required = false) MultipartFile titleImage,
                                                                   @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
                                                                   ) throws IOException {
        GatheringDto dto = GatheringDto.builder()
                .title(title)
                .category(GatheringCategory.valueOf(category.toUpperCase()))
                .type(GatheringType.valueOf(type.toUpperCase()))
                .dongName(dongName)
                .content(content)
                .introduction(introduction)
                .nickname(nickname)
                .build();

        Member m = userDetails.getMember();
        gatheringService.createGathering(dto, titleImage ,m, profileImage);
        return ResponseEntity.ok(new GatheringCreateResponse(dto.getTitle(), "소모임이 정상적으로 OPEN 되었습니다."));
    }
    
    // FREE 소모임 참여
    @PostMapping("/{gatheringId}/join")
    public ResponseEntity<String> joinGathering(
            @PathVariable Long gatheringId,
            @RequestPart("introduction") String introduction,
            @RequestPart("nickname") String nickname,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal CustomUserDetails userDetails) throws IOException {
        JoinGatheringDto dto = JoinGatheringDto.builder()
                .introduction(introduction)
                .nickname(nickname)
                .build();
        Member member = userDetails.getMember();
        gatheringService.joinGathering(gatheringId, dto, member, image);
        return ResponseEntity.ok(String.format("%d번 소모임 조인 성공", gatheringId));
    }
    
    // FREE 소모임 상세보기
    @GetMapping("/detail/{gatheringId}")
    public ResponseEntity<GatheringResponse> getGathering(@PathVariable Long gatheringId,
                                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member m = (userDetails != null) ? userDetails.getMember() : null;
        GatheringResponse response = gatheringService.getGathering(gatheringId, m);
        return ResponseEntity.ok(response);
    }
    
    // FREE 소모임 수정
    @PutMapping("/edit/{id}")
    public ResponseEntity<GatheringResponse> editGathering(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                   @PathVariable Long id,
                                                                   @RequestPart("title") String title,
                                                                   @RequestPart("category") String category,
                                                                   @RequestPart("dongName") String dongName,
                                                                   @RequestPart("content") String content,
                                                                   @RequestPart(value = "titleImage", required = false) MultipartFile titleImage) throws IOException {
        GatheringDto dto = GatheringDto.builder()
                .title(title)
                .category(GatheringCategory.valueOf(category.toUpperCase()))
                .dongName(dongName)
                .content(content)
                .build();

        Member m = userDetails.getMember();
        return ResponseEntity.ok(gatheringService.editGathering(id, dto, titleImage ,m));
    }
    
    // FREE 소모임 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<DeleteResponse> deleteGathering(@PathVariable Long id,
                                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member m = userDetails.getMember();
        gatheringService.deleteGathering(id, m);
        return ResponseEntity.ok(new DeleteResponse("소모임이 삭제되었습니다."));
    }
    
    // FREE 소모임 전체 조회
    @GetMapping("/list")
    public List<GatheringResponse> getGatheringList() {
        return gatheringService.getGatheringList();
    }
    
    // FREE 소모임 블랙리스트 등록
    @PostMapping("/{gatheringId}/blacklist/{targetMemberId}")
    public ResponseEntity<MessageResponse> addToBlacklist(
            @PathVariable Long gatheringId,
            @PathVariable Long targetMemberId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member member = userDetails.getMember();
        gatheringService.addToBlacklist(gatheringId, targetMemberId, member);
        return ResponseEntity.ok(new MessageResponse("블랙리스트 등록 완료:" + member.getUsername()));
    }
    
    // FREE 소모임 내 게시글 생성
    @PostMapping("/{gatheringId}/create/posts")
    public ResponseEntity<MessageResponse> createPost(
            @PathVariable Long gatheringId,
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart("category") String category,
            @RequestPart(value = "images", required = false) List<MultipartFile> image,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        GatheringPostRequest request = GatheringPostRequest.builder()
                .title(title)
                .content(content)
                .category(GatheringPostCategory.valueOf(category.toUpperCase()))
                .build();
        Member member = userDetails.getMember();
        gatheringService.createPost(gatheringId, request, member, image);
        return ResponseEntity.ok(new MessageResponse(gatheringId + "번 소모임 게시글 작성 성공:" + request.getTitle()));
    }
    

    // FREE 소모임 내 게시글 전부 조회
    @GetMapping("/{gatheringId}/getPosts")
    public ResponseEntity<List<GroupPostDto>> getPosts(@PathVariable Long gatheringId) {
        List<GroupPostDto> posts = gatheringService.getPosts(gatheringId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{gatheringId}/detail/{postId}")
    public ResponseEntity<GroupPostDto> getGatheringDetail(@PathVariable Long gatheringId,
                                                                @PathVariable Long postId,
                                                                @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member member = userDetails.getMember();
        GroupPostDto dto = gatheringService.detailPost(gatheringId, postId, member);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{gatheringId}/edit/{postId}")
    public ResponseEntity<GroupPostDto> editPost(@PathVariable Long gatheringId,
                                                 @PathVariable Long postId,
                                                 @RequestPart("title") String title,
                                                 @RequestPart("content") String content,
                                                 @RequestPart(value = "images", required = false) List<MultipartFile> image,
                                                 @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member member = userDetails.getMember();
        GroupPostDto dto = gatheringService.editPost(gatheringId, postId, title, content, image, member);
        return ResponseEntity.ok(dto);
    }

    // FREE 소모임 사진 올리기(사진첩)
    @PostMapping(value = "/{gatheringId}/photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MessageResponse> createPhoto(
            @PathVariable Long gatheringId,
            @RequestPart("image") MultipartFile image,
            @AuthenticationPrincipal CustomUserDetails userDetails) throws IOException {
        Member member = userDetails.getMember();
        gatheringService.createPhoto(gatheringId, image, member);
        return ResponseEntity.ok(new MessageResponse("소모임 사진첩 사진 업로드 성공, 유저이름: " + member.getUsername()));
    }

    // FREE 소모임 사진첩 사진 전부 조회
    @GetMapping("/{gatheringId}/photos")
    public ResponseEntity<List<GroupPhotoResponse>> getPhotos(@PathVariable Long gatheringId) {
        List<GroupPhotoResponse> photos = gatheringService.getPhotos(gatheringId);
        return ResponseEntity.ok(photos);
    }

}
