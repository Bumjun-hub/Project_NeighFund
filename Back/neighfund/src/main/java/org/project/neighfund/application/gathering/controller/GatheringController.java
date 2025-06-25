package org.project.neighfund.application.gathering.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.gathering.dto.*;
import org.project.neighfund.application.gathering.service.GatheringService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.GatheringCategory;
import org.project.neighfund.global.dto.MessageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/gatherings")
@RequiredArgsConstructor
public class GatheringController {
    private final GatheringService gatheringService;

    @PostMapping("create")
    public ResponseEntity<GatheringCreateResponse> createGathering(@AuthenticationPrincipal CustomUserDetails userDetails,
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
        gatheringService.createGathering(dto, titleImage ,m);
        return ResponseEntity.ok(new GatheringCreateResponse(dto.getTitle(), "소모임이 정상적으로 OPEN 되었습니다."));
    }

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

    @GetMapping("/detail/{gatheringId}")
    public ResponseEntity<GatheringResponse> getGathering(@PathVariable Long gatheringId,
                                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member m = (userDetails != null) ? userDetails.getMember() : null;
        GatheringResponse response = gatheringService.getGathering(gatheringId, m);
        return ResponseEntity.ok(response);
    }

    @PutMapping("edit/{id}")
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

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<DeleteResponse> deleteGathering(@PathVariable Long id,
                                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member m = userDetails.getMember();
        gatheringService.deleteGathering(id, m);
        return ResponseEntity.ok(new DeleteResponse("소모임이 삭제되었습니다."));
    }

    @GetMapping("/list")
    public List<GatheringResponse> getGatheringList() {
        return gatheringService.getGatheringList();
    }

    @PostMapping("/{gatheringId}/blacklist/{targetMemberId}")
    public ResponseEntity<MessageResponse> addToBlacklist(
            @PathVariable Long gatheringId,
            @PathVariable Long targetMemberId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Member member = userDetails.getMember();
        gatheringService.addToBlacklist(gatheringId, targetMemberId, member);
        return ResponseEntity.ok(new MessageResponse("블랙리스트 등록 완료:" + member.getUsername()));
    }
}
