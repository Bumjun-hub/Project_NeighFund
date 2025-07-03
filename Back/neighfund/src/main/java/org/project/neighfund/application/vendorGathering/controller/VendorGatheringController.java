package org.project.neighfund.application.vendorGathering.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.vendorGathering.dto.VendorGatheringCreateDto;
import org.project.neighfund.application.vendorGathering.dto.VendorGatheringCreateResponse;
import org.project.neighfund.application.vendorGathering.dto.VendorGatheringUpdateDto;
import org.project.neighfund.application.vendorGathering.service.VendorGatheringService;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.GatheringCategory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/gatherings/vendor")
@RequiredArgsConstructor
public class VendorGatheringController {
    private final VendorGatheringService vendorGatheringService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VendorGatheringCreateResponse> createVendorGathering(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestPart("title") String title,
            @RequestPart("category") String category,
            @RequestPart("content") String content,
            @RequestPart("dongName") String dongName,
            @RequestPart("productPrice") String productPrice,
            @RequestPart("productName") String productName,
            @RequestPart(value = "titleImage", required = false) MultipartFile titleImage,
            @RequestPart(value = "businessLicense", required = false) MultipartFile businessLicense) throws IOException {

        if (businessLicense == null) throw new IllegalArgumentException("사업자 등록증은 필수입니다.");
        VendorGatheringCreateDto dto = VendorGatheringCreateDto.builder()
                .title(title)
                .dongName(dongName)
                .content(content)
                .category(GatheringCategory.valueOf(category.toUpperCase()))
                .productPrice(Long.parseLong(productPrice))
                .productName(productName)
                .build();

        Member member = userDetails.getMember();
        vendorGatheringService.createVendorGathering(dto, titleImage, member, businessLicense);
        String message = "원데이클래스가 제출되었습니다. 관리자 검수를 기다려주세요.";
        return ResponseEntity.ok(new VendorGatheringCreateResponse(dto.getTitle(), message));
    }

    @PostMapping(value = "/{gatheringId}/updateDetails", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateVendorGatheringDetails(
            @PathVariable Long gatheringId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestPart(value = "freeParking", required = false) String freeParking,
            @RequestPart(value = "durationHours", required = false) String durationHours,
            @RequestPart(value = "productImages", required = false) List<MultipartFile> productImages) throws IOException {
        Member member = userDetails.getMember();
        VendorGatheringUpdateDto dto = VendorGatheringUpdateDto.builder()
                .freeParking(freeParking)
                .durationHours(durationHours)
                .build();
        vendorGatheringService.updateVendorGatheringDetails(gatheringId, dto, member, productImages);
        return ResponseEntity.ok("원데이클래스 디테일이 업데이트되었습니다.");
    }



}
