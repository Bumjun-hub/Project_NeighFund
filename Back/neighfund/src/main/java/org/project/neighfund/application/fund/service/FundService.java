package org.project.neighfund.application.fund.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.fund.dto.FundDto;
import org.project.neighfund.application.fund.dto.FundListDto;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.fund.FundImage;
import org.project.neighfund.domain.fund.FundImageRepository;
import org.project.neighfund.domain.fund.FundRepository;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;
import org.project.neighfund.enums.CommunityCategory;
import org.project.neighfund.enums.FundImageType;
import org.project.neighfund.enums.FundStatus;
import org.project.neighfund.global.image.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.RescaleOp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FundService {

    private final FundRepository fundRepository;
    private final MemberRepository memberRepository;
    private final FundImageRepository fundImageRepository;
    private final ImageService imageService;

    //작성
    @Transactional
    public void createPost(FundDto fundDto, List<FundImageType> imageTypes, List<MultipartFile> imageFiles, Member loginUser) {
        validateMember(loginUser);
        validateCreate(fundDto);

        //글작성
        Fund fund = Fund.builder()
                .member(loginUser)
                .category(fundDto.getCategory())
                .fundType(fundDto.getFundType())
                .fundStatus(FundStatus.ONGOING)
                .title(fundDto.getTitle())
                .content(fundDto.getContent())
                .currentParticipants(0)
                .targetAmount(fundDto.getTargetAmount())
                .currentAmount(0)
                .progressRate(0)
                .deadline(fundDto.getDeadline())
                .build();
        fundRepository.save(fund);

        //이미지 추가 - 이미지 타입별로 이미지를 넣어서 repository에 한번에 저장
        if (imageFiles != null && imageTypes != null && !imageFiles.isEmpty() && !imageTypes.isEmpty()) {
            if (imageFiles.size() != imageTypes.size()) {
                throw new IllegalArgumentException("이미지 수와 이미지 타입수가 일치하지 않습니다.");
            }
            for (int i = 0; i < imageFiles.size(); i++) {
                MultipartFile file = imageFiles.get(i);
                FundImageType type = imageTypes.get(i);
                String imageUrl = imageService.saveImage(file);

                if (imageUrl != null) {
                    FundImage fundImage = FundImage.builder()
                            .imgUrl(imageUrl)
                            .fund(fund)
                            .imageType(type)
                            .isDeleted(false)
                            .build();

                    fundImageRepository.save(fundImage);
                }
            }
        }
    }
    //수정
    @Transactional
    public void editPost(Long id, FundDto fundDto, List<FundImageType> imageTypes, List<MultipartFile> imageFiles,
                             List<Long> deleteImageIds,Member loginUser) {
        Fund fund = validatePost(id);
        validateMember(loginUser, fund.getMember());
        validateCreate(fundDto);

        fund.setCategory(fundDto.getCategory());
        fund.setFundType(fundDto.getFundType());
        fund.setFundStatus(fundDto.getFundStatus());
        fund.setTitle(fundDto.getTitle());
        fund.setSubTitle(fundDto.getSubTitle());
        fund.setContent(fundDto.getContent());
        fund.setTargetAmount(fundDto.getTargetAmount());
        fund.setDeadline(fundDto.getDeadline());

        //삭제로직
        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
            List<FundImage> imagesToDelete = fundImageRepository.findAllById(deleteImageIds);

            for (FundImage image : imagesToDelete) {
                if (image.getFund().getId().equals(id)) {
                    imageService.deleteImage(image.getImgUrl());
                    image.setIsDeleted(true);
                    fundImageRepository.save(image);
                }
            }
        }
        //추가
        if (imageFiles != null && imageTypes != null && !imageFiles.isEmpty() && !imageTypes.isEmpty()) {
            if (imageFiles.size() != imageTypes.size()) {
                throw new IllegalArgumentException("이미지 수와 이미지 타입수가 일치하지 않습니다.");
            }
            for (int i = 0; i < imageFiles.size(); i++) {
                MultipartFile file = imageFiles.get(i);
                FundImageType type = imageTypes.get(i);

                String imageUrl = imageService.saveImage(file);

                if (imageUrl != null) {
                    FundImage fundImage = FundImage.builder()
                            .imgUrl(imageUrl)
                            .fund(fund)
                            .imageType(type)
                            .isDeleted(false)
                            .build();

                    fundImageRepository.save(fundImage);
                }
            }
        }
    }
    //삭제
    @Transactional
    public void deletePost(Long id, Member loginUser) {
        Fund fund = validatePost(id);
        validateMember(loginUser, fund.getMember());
        fundRepository.delete(fund);
    }

    //조회
    public List<FundListDto> viewAll(CommunityCategory category, FundStatus status) {
        List<Fund> funds = fundRepository.findAll();

        return funds.stream()
                .filter(fund -> category == null || fund.getCategory() == category)
                .filter(fund -> status == null || fund.getFundStatus() == status)
                .map(fund -> FundListDto.builder()
                        .id(fund.getId())
                        .category(fund.getCategory())
                        .fundStatus(fund.getFundStatus())
                        .title(fund.getTitle())
                        .subTitle(fund.getSubTitle())
                        .thumbnailUrl(
                                fund.getFundImages().stream()
                                        .filter(fundImage -> fundImage.getImageType() == FundImageType.THUMBNAIL && !fundImage.getIsDeleted())
                                        .map(FundImage::getImgUrl)
                                        .findFirst()
                                        .orElse(null)
                        )
                        .progressRate(fund.getProgressRate())
                        .targetAmount(fund.getTargetAmount())
                        .deadline(fund.getDeadline())
                        .likes((long) fund.getLikes().size())
                        .liked(false)
                        .build())
                .collect(Collectors.toList());
    }

    //상세조회


    // 사용자 정보 확인
    public void validateMember (Member loginUser){
        Member foundMember = memberRepository.findById(loginUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("해당사용자가 존재하지 않습니다"));

        if (!foundMember.getEmail().equals(loginUser.getEmail())) {
            throw new AccessDeniedException("사용자 정보가 일치하지 않습니다.");
        }
    }

    // 글작성 공백확인
    public void validateCreate (FundDto fundDto){
        if (fundDto.getFundType() == null ) {
            throw new IllegalArgumentException("타입을 선택 해주세요");
        }
        if (fundDto.getTitle() == null || fundDto.getTitle().isBlank()) {
            throw new IllegalArgumentException("제목을 입력하세요");
        }
        if (fundDto.getSubTitle() == null || fundDto.getSubTitle().isBlank()) {
            throw new IllegalArgumentException("소제목을 입력하세요");
        }
        if (fundDto.getTargetAmount() == null || fundDto.getTargetAmount() <= 0) {
            throw new IllegalArgumentException("목표금액을 입력하세요");
        }
        if (fundDto.getDeadline() == null || fundDto.getDeadline().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("마감일은 현재 이후로 설정해주세요");
        }
    }

    //작성자확인
    public void validateMember (Member loginUser, Member writer){
        if (!loginUser.getId().equals(writer.getId())) {
            throw new AccessDeniedException("작성자만 가능합니다");
        }
    }

    //글존재유무확인
    public Fund validatePost (Long id){
        return fundRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다"));
    }



}
