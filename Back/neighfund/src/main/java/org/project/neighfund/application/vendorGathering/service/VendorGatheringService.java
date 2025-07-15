package org.project.neighfund.application.vendorGathering.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.vendorGathering.dto.*;
import org.project.neighfund.domain.gathering.Gathering;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;
import org.project.neighfund.domain.vendorGathering.VendorGathering;
import org.project.neighfund.domain.vendorGathering.VendorGatheringImage;
import org.project.neighfund.domain.vendorGathering.VendorGatheringRepository;
import org.project.neighfund.enums.GatheringType;
import org.project.neighfund.enums.RoleName;
import org.project.neighfund.global.image.ImageService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.project.neighfund.application.vendorGathering.dto.VendorGatheringAdminResponseDto;



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
    public Long createVendorGathering(VendorGatheringCreateDto dto, MultipartFile titleImage, Member member, MultipartFile businessLicense) throws IOException {
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
                .maxParticipants(dto.getMaxParticipants())
                .build();

        VendorGathering saved = vendorGatheringRepository.save(vendorG);
        return saved.getId(); // ID 반환
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

    public VendorDetailResponse getVendorGathering(Long gatheringId, Member member) {
        VendorGathering gathering = vendorGatheringRepository.findById(gatheringId)
                .orElseThrow(() -> new IllegalArgumentException("소모임을 찾을 수 없습니다."));
        return toGatheringDetailResponse(gathering);
    }

    public List<VendorDetailResponse> getVendorGatheringList() {
        List<VendorGathering> vendorGatheringList = vendorGatheringRepository.findAll();
        return vendorGatheringList.stream()
                .map(this::toGatheringDetailResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void confirmVendorGathering(Long gatheringId, AdminConfirmDto dto, Member admin) {
        if (!admin.getRole().equals(RoleName.ROLE_ADMIN)) throw new IllegalStateException("관리자만 승인할 수 있습니다.");
        VendorGathering gathering = vendorGatheringRepository.findById(gatheringId)
                .orElseThrow(() -> new IllegalArgumentException("소모임을 찾을 수 없습니다."));
        gathering.setConfirmed(dto.isConfirmed());
        vendorGatheringRepository.save(gathering);
    }

    public void deleteGathering(Long id, Member m) {
        validateMember(m);
        VendorGathering vendorGathering = vendorGatheringRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 원데이 클래스입니다."));

        if (!vendorGathering.getMember().getId().equals(m.getId())) {
            throw new IllegalArgumentException("원데이클래스 작성자만 원데이클래스를 삭제할 수 있습니다.");
        }

        vendorGatheringRepository.delete(vendorGathering);
    }

    // 사용자 정보 확인
    public void validateMember (Member m){
        Member member = memberRepository.findById(m.getId())
                .orElseThrow(() -> new IllegalArgumentException("해당사용자가 존재하지 않습니다"));

        if (!member.getEmail().equals(m.getEmail())) {
            throw new AccessDeniedException("사용자 정보가 일치하지 않습니다.");
        }
    }

    private VendorDetailResponse toGatheringDetailResponse(VendorGathering gathering) {
        boolean liked = false;
        VendorDetailResponse dto = new VendorDetailResponse();
        dto.setConfirmed(gathering.isConfirmed());
        dto.setId(gathering.getId());
        dto.setTitle(gathering.getTitle());
        dto.setCategory(gathering.getCategory());
        dto.setDongName(gathering.getDongName());
        dto.setContent(gathering.getContent());
        dto.setTitleImage(gathering.getTitleImage());
        dto.setProductPrice(gathering.getProductPrice());
        dto.setProductName(gathering.getProductName());
        dto.setFreeParking(gathering.getFreeParking());
        dto.setDurationHours(gathering.getDurationHours());
        dto.setCreatedAt(gathering.getCreatedAt());
        dto.setUpdatedAt(gathering.getUpdatedAt());
        dto.setLikes((long) gathering.getLikes().stream().filter(l -> l.getGathering() != null).count());
        dto.setLiked(liked);
        dto.setImages(gathering.getImages().stream().map(img -> VendorImageDto.builder()
                .id(img.getId())
                .imageUrl(img.getImgUrl())
                .build())
                .collect(Collectors.toList())
        );
        dto.setReservationSlots(gathering.getReservationSlots().stream()
                .map(slot -> ReservationSlotDto.builder()
                        .id(slot.getId())
                        .build())
        .collect(Collectors.toList())
        );
        return dto;
    }
    // 관리자용 벤더 개더링 목록 조회 (승인 대기 포함)
    public List<VendorGatheringAdminResponseDto> getVendorGatheringsForAdmin(Member loginUser) {
        validateAdmin(loginUser);

        List<VendorGathering> gatherings = vendorGatheringRepository.findAll();

        return gatherings.stream()
                .map(gathering -> VendorGatheringAdminResponseDto.builder()
                        .id(gathering.getId())
                        .title(gathering.getTitle())
                        .description(gathering.getContent())
                        .category(gathering.getCategory() != null ? gathering.getCategory().toString() : "")
                        .maxParticipants(gathering.getMaxParticipants())
                        .duration(0) // 임시로 0 설정
                        .price(gathering.getProductPrice())
                        .location(gathering.getDongName())
                        .vendorName(gathering.getMember() != null ? gathering.getMember().getUsername() : "")
                        .vendorContact(gathering.getMember() != null ? gathering.getMember().getPhone() : "")
                        .vendorEmail(gathering.getMember() != null ? gathering.getMember().getEmail() : "")
                        .materials(gathering.getProductName() != null ? gathering.getProductName() : "")
                        .requirements("")
                        .status(gathering.isConfirmed() ? "APPROVED" : "PENDING")
                        .submittedAt(gathering.getCreatedAt())
                        .vendorExperience("")
                        .build())
                .toList();
    }

    // 벤더 개더링 승인
    @Transactional
    public void approveVendorGathering(Long gatheringId, Member loginUser) {
        validateAdmin(loginUser);

        VendorGathering gathering = vendorGatheringRepository.findById(gatheringId)
                .orElseThrow(() -> new IllegalArgumentException("해당 클래스가 존재하지 않습니다."));

        gathering.setConfirmed(true);
        vendorGatheringRepository.save(gathering);
    }

    // 벤더 개더링 거절
    @Transactional
    public void rejectVendorGathering(Long gatheringId, Member loginUser) {
        validateAdmin(loginUser);

        VendorGathering gathering = vendorGatheringRepository.findById(gatheringId)
                .orElseThrow(() -> new IllegalArgumentException("해당 클래스가 존재하지 않습니다."));

        gathering.setConfirmed(false);
        // 거절 상태를 명확히 표시하기 위해 별도 필드가 필요할 수 있음
        // 현재는 confirmed=false로 처리
        vendorGatheringRepository.save(gathering);
    }

    // 관리자 권한 검증
    private void validateAdmin(Member loginUser) {
        if (loginUser == null) {
            throw new AccessDeniedException("로그인이 필요합니다");
        }
        if (!loginUser.getRole().getName().equals(RoleName.ROLE_ADMIN)) {
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        }
    }

}
