package org.project.neighfund.application.vendorGathering.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.vendorGathering.dto.GatheringVendorResponse;
import org.project.neighfund.application.vendorGathering.dto.VendorGatheringCreateDto;
import org.project.neighfund.application.vendorGathering.dto.VendorGatheringUpdateDto;
import org.project.neighfund.domain.gathering.Gathering;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;
import org.project.neighfund.domain.vendorGathering.VendorGathering;
import org.project.neighfund.domain.vendorGathering.VendorGatheringImage;
import org.project.neighfund.domain.vendorGathering.VendorGatheringRepository;
import org.project.neighfund.enums.GatheringType;
import org.project.neighfund.global.image.ImageService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VendorGatheringService {
    private final VendorGatheringRepository vendorGatheringRepository;
    private final MemberRepository memberRepository;
    private final ImageService imageService;

    @Transactional
    public void createVendorGathering(VendorGatheringCreateDto dto, MultipartFile titleImage, Member member, MultipartFile businessLicense) throws IOException {
        validateMember(member);
        if (businessLicense == null) throw new IllegalArgumentException("사업자 등록증은 필수입니다.");

        String imageUrl = titleImage != null ? imageService.saveGatheringImage(titleImage, member.getEmail()) : null;

        String businessLicenseUrl = imageService.saveGatheringImage(businessLicense, member.getEmail());
        VendorGathering vendorG = VendorGathering.builder()
                .title(dto.getTitle())
                .category(dto.getCategory())
                .dongName(dto.getDongName())
                .content(dto.getContent())
                .titleImage(imageUrl)
                .member(member)
                .type(GatheringType.VENDOR)
                .businessLicenseUrl(businessLicenseUrl)
                .productPrice(dto.getProductPrice())
                .productName(dto.getProductName())
                .build();
        vendorGatheringRepository.save(vendorG);
    }

    @Transactional
    public void updateVendorGatheringDetails(Long gatheringId, VendorGatheringUpdateDto dto, Member member, List<MultipartFile> productImages) throws IOException {
        VendorGathering gathering = vendorGatheringRepository.findById(gatheringId)
                .orElseThrow(() -> new IllegalArgumentException("소모임을 찾을 수 없습니다."));
        if (!gathering.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("소모임 생성자만 디테일을 수정할 수 있습니다.");
        }

        if (dto.getFreeParking() != null) gathering.setFreeParking(dto.getFreeParking());
        if (dto.getDurationHours() != null) gathering.setDurationHours(dto.getDurationHours());

        if (productImages != null && !productImages.isEmpty()) {
            List<VendorGatheringImage> images = productImages.stream()
                    .map(file -> VendorGatheringImage.builder()
                            .vendorGathering(gathering)
                            .imgUrl(imageService.saveGatheringImage(file, member.getEmail()))
                            .build())
                    .collect(Collectors.toList());

            if (gathering.getImages() == null) {
                gathering.setImages(new ArrayList<>());
            }
            gathering.getImages().addAll(images);
        }
        vendorGatheringRepository.save(gathering);
    }

    // 사용자 정보 확인
    public void validateMember (Member m){
        Member member = memberRepository.findById(m.getId())
                .orElseThrow(() -> new IllegalArgumentException("해당사용자가 존재하지 않습니다"));

        if (!member.getEmail().equals(m.getEmail())) {
            throw new AccessDeniedException("사용자 정보가 일치하지 않습니다.");
        }
    }

    private GatheringVendorResponse toGatheringResponse(Gathering gathering, VendorGathering product) {
        boolean liked = false;
        GatheringVendorResponse dto = new GatheringVendorResponse();
        dto.setId(gathering.getId());
        dto.setProductId(product.getId());
        dto.setTitle(gathering.getTitle());
        dto.setCategory(gathering.getCategory().name());
        dto.setDongName(gathering.getDongName());
        dto.setContent(gathering.getContent());
        dto.setTitleImage(gathering.getTitleImage());
        dto.setCreatedAt(gathering.getCreatedAt());
        dto.setUpdatedAt(gathering.getUpdatedAt());
        dto.setLikes((long) gathering.getLikes().stream().filter(l -> l.getGathering() != null).count());
        dto.setLiked(liked);
        dto.setMemberCount(gathering.getMemberCount());
        return dto;
    }
}
