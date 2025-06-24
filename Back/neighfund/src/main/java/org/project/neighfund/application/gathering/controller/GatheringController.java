package org.project.neighfund.application.gathering.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.gathering.dto.GatheringCreateResponse;
import org.project.neighfund.application.gathering.dto.GatheringDto;
import org.project.neighfund.application.gathering.dto.GatheringResponse;
import org.project.neighfund.application.gathering.dto.DeleteResponse;
import org.project.neighfund.application.gathering.service.GatheringService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.GatheringCategory;
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
}
