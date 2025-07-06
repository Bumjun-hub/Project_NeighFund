package org.project.neighfund.application.fund.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.project.neighfund.application.fund.dto.FundDto;
import org.project.neighfund.application.fund.dto.FundListDto;
import org.project.neighfund.application.fund.dto.FundOptionDto;
import org.project.neighfund.application.fund.dto.FundResponseDto;
import org.project.neighfund.application.websocket.service.NotificationService;
import org.project.neighfund.domain.fund.*;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;
import org.project.neighfund.enums.CommunityCategory;
import org.project.neighfund.enums.FundStatus;
import org.project.neighfund.enums.FundType;
import org.project.neighfund.enums.RoleName;
import org.project.neighfund.global.image.ImageService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FundService {

    private final FundRepository fundRepository;
    private final MemberRepository memberRepository;
    private final FundImageRepository fundImageRepository;
    private final FundContentImageRepository fundContentImageRepository;
    private final FundOptionRepository fundOptionRepository;
    private final ImageService imageService;
    private final NotificationService notificationService;

    //작성
    @Transactional
    public void createPost(FundDto fundDto, List<MultipartFile> imageFiles,List<MultipartFile>contentImages, Member loginUser) {
        validateMember(loginUser);
        validateCreate(fundDto);

        //글작성
        Fund fund = Fund.builder()
                .member(loginUser)
                .category(fundDto.getCategory())
                .fundType(fundDto.getFundType())
                .fundStatus(FundStatus.ONGOING)
                .isApproved(false)
                .title(fundDto.getTitle())
                .subTitle(fundDto.getSubTitle())
                .content(fundDto.getContent())
                .currentParticipants(0)
                .targetAmount(fundDto.getTargetAmount())
                .currentAmount(0L)
                .progressRate(0)
                .deadline(fundDto.getDeadline())
                .hashTags(fundDto.getHashTags())
                .build();
        fundRepository.save(fund);

        //option
        List<FundOptionDto> options = fundDto.getOptions();
        if (options != null && !options.isEmpty()) {
            for (FundOptionDto optionDto : options) {
                FundOption option = FundOption.builder()
                        .fund(fund)
                        .price(optionDto.getPrice())
                        .content(optionDto.getContent())
                        .quantity(optionDto.getQuantity())
                        .title(optionDto.getTitle())
                        .description(optionDto.getDescription())
                        .build();
                fundOptionRepository.save(option);
            }
        }

        //썸네일 + 내용
            for (MultipartFile imageFile : imageFiles) {
                String imageUrl = imageService.saveImage(imageFile);

                if (imageUrl != null) {
                    FundImage image = FundImage.builder()
                            .imgUrl(imageUrl)
                            .fund(fund)
                            .isDeleted(false)
                            .build();
                    fundImageRepository.save(image);
                }
            }
        // content용
            for (MultipartFile contentFile : contentImages) {
                String imageUrl = imageService.saveImage(contentFile);

                if (imageUrl != null) {
                    FundContentImage image = FundContentImage.builder()
                            .imgUrl(imageUrl)
                            .fund(fund)
                            .isDeleted(false)
                            .build();
                    fundContentImageRepository.save(image);
                }
            }

        // 공동구매 오픈 알림
        String content = "🔔 \"" + fund.getTitle() + "\" 새로운 펀드가 OPEN 되었습니다!";
        notificationService.sendFundOpenToAll(
                fund, content
        );
    }

    //수정  글을 수정하면 다시 검수 받아야 함
    @Transactional
    public void editPost(Long id, FundDto fundDto, List<MultipartFile> imageFiles,List<MultipartFile>contentImages,
                             List<Long> deleteImageIds, List<Long>deleteContentImageIds, Member loginUser) {
        Fund fund = validatePost(id);
        validateMember(loginUser, fund.getMember());
        validateCreate(fundDto);
        fund.setCategory(fundDto.getCategory());
        fund.setFundType(fundDto.getFundType());
        fund.setIsApproved(false);
        fund.setFundStatus(fundDto.getFundStatus());
        fund.setTitle(fundDto.getTitle());
        fund.setSubTitle(fundDto.getSubTitle());
        fund.setContent(fundDto.getContent());
        fund.setTargetAmount(fundDto.getTargetAmount());
        fund.setDeadline(fundDto.getDeadline());
        fund.setHashTags(fundDto.getHashTags());

        //썸네일+내용
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

        if (imageFiles != null && !imageFiles.isEmpty()) {
            for (MultipartFile imageFile : imageFiles) {
                if (!imageFile.isEmpty()) {
                    String imageUrl = imageService.saveImage(imageFile);

                    if (imageUrl != null) {
                        FundImage image = FundImage.builder()
                                .imgUrl(imageUrl)
                                .fund(fund)
                                .isDeleted(false)
                                .build();
                        fundImageRepository.save(image);
                    }
                }
            }
        }
        //contentImage상세내용이미지
        if (deleteContentImageIds != null && !deleteContentImageIds.isEmpty()) {
            List<FundContentImage> imagesToDelete = fundContentImageRepository.findAllById(deleteContentImageIds);

            for (FundContentImage image : imagesToDelete) {
                if (image.getFund().getId().equals(id)) {
                    imageService.deleteImage(image.getImgUrl());
                    image.setIsDeleted(true);
                    fundContentImageRepository.save(image);
                }
            }
        }

        if (contentImages != null && !contentImages.isEmpty()) {
            for (MultipartFile imageFile : contentImages) {
                if (!imageFile.isEmpty()) {
                    String imageUrl = imageService.saveImage(imageFile);

                    if (imageUrl != null) {
                        FundContentImage image = FundContentImage.builder()
                                .imgUrl(imageUrl)
                                .fund(fund)
                                .isDeleted(false)
                                .build();

                        fundContentImageRepository.save(image);
                    }
                }
            }
        }
     //옵션관련
        //옵션조회
        List<FundOption> findOptions = fundOptionRepository.findByFund(fund);
        Map<Long, FundOption> findOptionMap = findOptions.stream()
                .collect(Collectors.toMap(FundOption::getId, option -> option));
        //생성
        List<FundOptionDto> options = fundDto.getOptions();
        if (options != null && !options.isEmpty()){
            for (FundOptionDto dto : options){
                if (dto.getId() == null) {
                    //생성
                    FundOption newOption = FundOption.builder()
                            .fund(fund)
                            .title(dto.getTitle())
                            .price(dto.getPrice())
                            .content(dto.getContent())
                            .quantity(dto.getQuantity())
                            .description(dto.getDescription())
                            .build();
                    fundOptionRepository.save(newOption);
                } else {
                    //수정
                    FundOption editOption = findOptionMap.get(dto.getId());
                    if (editOption != null) {
                        editOption.setTitle(dto.getTitle());
                        editOption.setPrice(dto.getPrice());
                        editOption.setContent(dto.getContent());
                        editOption.setQuantity(dto.getQuantity());
                        editOption.setDescription(dto.getDescription());
                        fundOptionRepository.save(editOption);
                        findOptionMap.remove(dto.getId());

                    }
                }
            }
        }
        //삭제
        for (FundOption deleteOption : findOptionMap.values()) {
            fundOptionRepository.delete(deleteOption);
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
    public List<FundListDto> viewAll(CommunityCategory category, FundStatus status, FundType type) {
        List<Fund> funds = fundRepository.findAllByIsApprovedTrue();

        return funds.stream()
                .filter(fund -> category == null || fund.getCategory() == category)
                .filter(fund -> status == null || fund.getFundStatus() == status)
                .filter(fund -> type == null || fund.getFundType() == type)
                .map(fund -> FundListDto.builder()
                        .id(fund.getId())
                        .category(fund.getCategory())
                        .fundStatus(fund.getFundStatus())
                        .fundType(fund.getFundType())
                        .title(fund.getTitle())
                        .subTitle(fund.getSubTitle())
                        .imageUrl(
                                fund.getFundImages().stream()
                                        .filter(fundImage -> !fundImage.getIsDeleted())
                                        .map(FundImage::getImgUrl)
                                        .findFirst()
                                        .orElse(null)  //첫번째 이미지 -> 썸네일
                        )
                        .progressRate(fund.getProgressRate())
                        .targetAmount(fund.getTargetAmount())
                        .deadline(fund.getDeadline())
                        .build())
                .collect(Collectors.toList());
    }

    //상세조회
    @Transactional
    public FundResponseDto detailView(Long id, Member loginUser) {
        Fund fund = fundRepository.findByIdAndIsApprovedTrue(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 펀딩입니다."));

        List<FundOptionDto> options = fund.getFundOptions().stream()
                .map(option -> FundOptionDto.builder()
                        .id(option.getId())
                        .title(option.getTitle())
                        .description(option.getDescription())
                        .amount(option.getPrice())
                        .price(option.getPrice())
                        .content(option.getContent())
                        .quantity(option.getQuantity())
                        .build())
                .collect(Collectors.toList());

        List<String> fundImageUrls = fund.getFundImages().stream()
                .filter(img -> !img.getIsDeleted())
                .map(FundImage::getImgUrl)
                .collect(Collectors.toList());

        List<Long> fundImageIds = fund.getFundImages().stream()
                .filter(img -> !img.getIsDeleted())
                .map(FundImage::getId)
                .collect(Collectors.toList());

        List<String> contentImgUrls = fund.getFundContentImages().stream()
                .filter(img -> !img.getIsDeleted())
                .map(FundContentImage::getImgUrl)
                .collect(Collectors.toList());

        List<Long> contentImgIds = fund.getFundContentImages().stream()
                .filter(img -> !img.getIsDeleted())
                .map(FundContentImage::getId)
                .collect(Collectors.toList());


        // ⭐ 로그인 여부에 따라 추천 상태 처리
        boolean liked = false;
        if (loginUser != null && loginUser.getId() != null) {
            liked = fund.getLikes().stream()
                    .filter(like -> like.getFund() != null && like.getMember() != null)
                    .anyMatch(like -> like.getMember().getId().equals(loginUser.getId()));
        }

        return FundResponseDto.builder()
                .id(fund.getId())
                .username(fund.getMember().getUsername())
                .category(fund.getCategory())
                .fundType(fund.getFundType())
                .fundStatus(fund.getFundStatus())
                .options(options)
                .title(fund.getTitle())
                .subTitle(fund.getSubTitle())
                .content(fund.getContent())
                .fundImages(fundImageUrls)
                .imgIds(fundImageIds)
                .contentImgUrls(contentImgUrls)
                .contentImgIds(contentImgIds)
                .progressRate(fund.getProgressRate())
                .targetAmount(fund.getTargetAmount())
                .currentAmount(fund.getCurrentAmount())
                .currentParticipants(fund.getCurrentParticipants())
                .deadline(fund.getDeadline())
                .hashTags(fund.getHashTags())
                .likes((long) fund.getLikes().size())
                .liked(liked)
                .build();
    }

    //관리자 검수 상태 변경
    @Transactional
    public void approveFund(Long id, Member loginUser) {
        validateLogin(loginUser);
        Fund fund = validatePost(id);
        fund.setIsApproved(true);
    }

    //예외처리메소드
    @Transactional
    public List<FundResponseDto> getUnapprovedFunds(Member loginUser) {
        validateLogin(loginUser);
        List<Fund> unapproved = fundRepository.findByIsApprovedFalse();

        return unapproved.stream().map(f -> FundResponseDto.builder()
                .id(f.getId())
                .username(f.getMember().getUsername())
                .title(f.getTitle())
                .subTitle(f.getSubTitle())
                .content(f.getContent())
                .category(f.getCategory())
                .fundType(f.getFundType())
                .fundStatus(f.getFundStatus())
                .targetAmount(f.getTargetAmount())
                .currentAmount(f.getCurrentAmount())
                .currentParticipants(f.getCurrentParticipants())
                .progressRate(f.getProgressRate())
                .deadline(f.getDeadline())
                .hashTags(f.getHashTags())
                .fundImages(f.getFundImages().stream()
                        .map(FundImage::getImgUrl)
                        .toList())
                .contentImgUrls(f.getFundContentImages().stream()
                        .map(FundContentImage::getImgUrl)
                        .toList())
                .options(f.getFundOptions().stream()
                        .map(opt -> FundOptionDto.builder()
                                .id(opt.getId())
                                .title(opt.getTitle())
                                .description(opt.getDescription())
                                .price(opt.getPrice())
                                .quantity(opt.getQuantity())
                                .build())
                        .toList())
                .build()
        ).toList();
    }

    @Transactional
    public void completedFund(Long fundId) {
        Fund fund = fundRepository.findById(fundId)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 펀드 게시글 번호입니다."));

        if (fund.getFundStatus() == FundStatus.CLOSED) {
            log.warn("펀드 {}는 이미 마감되었습니다.", fundId);
            return;
        }

        fund.setFundStatus(FundStatus.CLOSED);
        fundRepository.save(fund);

        String content = "🔔 \"" + fund.getTitle() + "\" 펀드가 마감 되었습니다. 구매 신청을 진행해주세요!";
        notificationService.sendGruopBuyCompletedToParticipants(fundId, content);

        log.info("공동구매 {} 마감 완료 및 알림 전송", fundId);
    }


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

    //로그인 사용자 기준
    public void validateLogin(Member member) {
        if (member == null) {
            throw new IllegalArgumentException("로그인이 필요한 기능입니다.");
        }
        if (member.getRole().getName() != RoleName.ROLE_ADMIN) {
            throw new AccessDeniedException("관리자만 사용할 수 있는 기능입니다.");
        }
    }


    public FundResponseDto getUnapprovedDetail(Long id, Member loginUser) {
        validateLogin(loginUser); // 관리자 확인
        Fund fund  = validatePost(id); // isApproved 검사 X

        List<FundOptionDto> options = fund.getFundOptions().stream()
                .map(option -> FundOptionDto.builder()
                        .id(option.getId())
                        .title(option.getTitle())
                        .description(option.getDescription())
                        .amount(option.getPrice())
                        .price(option.getPrice())
                        .content(option.getContent())
                        .quantity(option.getQuantity())
                        .build())
                .collect(Collectors.toList());

        List<String> fundImageUrls = fund.getFundImages().stream()
                .filter(img -> !img.getIsDeleted())
                .map(FundImage::getImgUrl)
                .collect(Collectors.toList());

        List<Long> fundImageIds = fund.getFundImages().stream()
                .filter(img -> !img.getIsDeleted())
                .map(FundImage::getId)
                .collect(Collectors.toList());

        List<String> contentImgUrls = fund.getFundContentImages().stream()
                .filter(img -> !img.getIsDeleted())
                .map(FundContentImage::getImgUrl)
                .collect(Collectors.toList());

        List<Long> contentImgIds = fund.getFundContentImages().stream()
                .filter(img -> !img.getIsDeleted())
                .map(FundContentImage::getId)
                .collect(Collectors.toList());

        return FundResponseDto.builder()
                .id(fund.getId())
                .username(fund.getMember().getUsername())
                .category(fund.getCategory())
                .fundType(fund.getFundType())
                .fundStatus(fund.getFundStatus())
                .options(options)
                .title(fund.getTitle())
                .subTitle(fund.getSubTitle())
                .content(fund.getContent())
                .fundImages(fundImageUrls)
                .imgIds(fundImageIds)
                .contentImgUrls(contentImgUrls)
                .contentImgIds(contentImgIds)
                .progressRate(fund.getProgressRate())
                .targetAmount(fund.getTargetAmount())
                .currentAmount(fund.getCurrentAmount())
                .currentParticipants(fund.getCurrentParticipants())
                .deadline(fund.getDeadline())
                .hashTags(fund.getHashTags())
                .likes((long) fund.getLikes().size())
                .liked(false) // 미승인 상태에서는 좋아요 의미 없음
                .build();
    }

}
