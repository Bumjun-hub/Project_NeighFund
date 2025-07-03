package org.project.neighfund.application.gathering.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.gathering.dto.*;

import org.project.neighfund.domain.gathering.*;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;

import org.project.neighfund.domain.vendorGathering.VendorProductRepository;
import org.project.neighfund.enums.GatheringPostCategory;
import org.project.neighfund.enums.GatheringRole;

import org.project.neighfund.global.image.ImageService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class GatheringService {
    private final GatheringRepository gatheringRepository;
    private final MemberRepository memberRepository;
    private final ImageService imageService;
    private final BlacklistRepository blacklistRepository;
    private final GatheringMemberRepository gatheringMemberRepository;
    private final GatheringPostRepository gatheringPostRepository;
    private final PostImageRepository postImageRepository;
    private final GatheringPhotoRepository gatheringPhotoRepository;

    public void createGathering(GatheringDto dto, MultipartFile file, Member m, MultipartFile profileImage) throws IOException {
        validateMember(m);
        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new IllegalArgumentException("제목을 입력하세요");
        }
        if (dto.getContent() == null || dto.getContent().isBlank()) {
            throw new IllegalArgumentException("내용을 입력하세요");
        }

        String titleImage = imageService.saveGatheringImage(file, m.getEmail());
        String profileImagePath = imageService.saveGatheringImage(profileImage, m.getEmail());

        Gathering gathering = Gathering.builder()
                .title(dto.getTitle())
                .category(dto.getCategory())
                .content(dto.getContent())
                .dongName(dto.getDongName())
                .titleImage(titleImage)
                .member(m)
                .memberCount(1)
                .type(dto.getType())
                .build();
        gatheringRepository.save(gathering);

        GatheringMember gatheringMember = GatheringMember.builder()
                .gathering(gathering)
                .member(m)
                .role(GatheringRole.LEADER)
                .introduction(dto.getIntroduction())
                .nickname(dto.getNickname())
                .imageUrl(profileImagePath)
                .build();

        gatheringMemberRepository.save(gatheringMember);
    }

    public GatheringResponse getGathering(Long gatheringId, Member m) {
        Gathering gathering = gatheringRepository.findById(gatheringId)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 소모임 게시글 번호입니다."));

        // ⭐ 로그인 여부에 따라 추천 상태 처리
        boolean liked = false;
        if (m != null && m.getId() != null) {
            liked = gathering.getLikes().stream()
                    .filter(like -> like.getGathering() != null && like.getMember() != null)
                    .anyMatch(like -> like.getMember().getId().equals(m.getId()));
        }

        return GatheringResponse.builder()
                .id(gathering.getId())
                .title(gathering.getTitle())
                .category(gathering.getCategory().name())
                .content(gathering.getContent())
                .dongName(gathering.getDongName())
                .titleImage(gathering.getTitleImage())
                .createdAt(gathering.getCreatedAt())
                .updatedAt(gathering.getUpdatedAt())
                .likes((long) gathering.getLikes().stream().filter(like -> like.getGathering() != null).count())
                .liked(liked)
                .memberCount(gathering.getMemberCount())
                .build();
    }

    public GatheringResponse editGathering(Long id, GatheringDto dto, MultipartFile file, Member m) {
        validateMember(m);
        Gathering gathering = gatheringRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("소모임을 찾을 수 없습니다."));

        if (!gathering.getMember().getId().equals(m.getId())) {
            throw new IllegalStateException("리더만 소모임을 수정할 수 있습니다.");
        }

        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new IllegalArgumentException("제목을 입력하세요");
        }
        if (dto.getContent() == null || dto.getContent().isBlank()) {
            throw new IllegalArgumentException("내용을 입력하세요");
        }

        if (file != null && !file.isEmpty()) {
            imageService.deleteGatheringImage(gathering);
        }

        // 새 이미지 저장
        String newTitleImage = imageService.saveGatheringImage(file, m.getEmail());

        gathering.setTitle(dto.getTitle());
        gathering.setCategory(dto.getCategory());
        gathering.setContent(dto.getContent());
        gathering.setDongName(dto.getDongName());
        gathering.setTitleImage(newTitleImage);
        gathering.setMember(m);

        // ⭐ 로그인 여부에 따라 추천 상태 처리
        boolean liked = false;
        if (m != null && m.getId() != null) {
            liked = gathering.getLikes().stream()
                    .filter(like -> like.getGathering() != null && like.getMember() != null)
                    .anyMatch(like -> like.getMember().getId().equals(m.getId()));
        }

        gatheringRepository.save(gathering);

        return GatheringResponse.builder()
                .id(gathering.getId())
                .title(gathering.getTitle())
                .category(gathering.getCategory().name())
                .content(gathering.getContent())
                .dongName(gathering.getDongName())
                .titleImage(gathering.getTitleImage())
                .createdAt(gathering.getCreatedAt())
                .updatedAt(gathering.getUpdatedAt())
                .likes((long)gathering.getLikes().stream().filter(like -> like.getGathering() != null).count())
                .liked(liked)
                .memberCount(gathering.getMemberCount())
                .build();
    }

    public void deleteGathering(Long id, Member m) {
        validateMember(m);
        Gathering gathering = gatheringRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 소모임입니다."));

        if (!gathering.getMember().getId().equals(m.getId())) {
            throw new IllegalArgumentException("소모임 리더만이 소모임을 삭제할 수 있습니다.");
        }

        gatheringRepository.delete(gathering);
    }

    public List<GatheringResponse> getGatheringList() {
        List<Gathering> gatherings = gatheringRepository.findAll();
        return gatherings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public void joinGathering(Long gatheringId, JoinGatheringDto dto, Member member, MultipartFile image) {
        Gathering gathering = gatheringRepository.findById(gatheringId)
                .orElseThrow(() -> new IllegalArgumentException("소모임을 찾을 수 없습니다."));

        if (blacklistRepository.existsByGatheringIdAndMemberId(gatheringId, member.getId())) {
            throw new IllegalStateException("블랙리스트에 등록된 사용자는 참여할 수 없습니다.");
        }

        if (gatheringMemberRepository.findByGatheringIdAndMemberId(gatheringId, member.getId()).isPresent()) {
            throw new IllegalStateException("이미 참여한 소모임입니다.");
        }
        if (gatheringMemberRepository.existsByGatheringIdAndNickname(gatheringId, dto.getNickname())) {
            throw new IllegalStateException("이미 사용 중인 닉네임입니다.");
        }

        String profileImage = imageService.saveGatheringImage(image, member.getEmail());

        GatheringMember gatheringMember = GatheringMember.builder()
                .gathering(gathering)
                .member(member)
                .role(GatheringRole.USER)
                .introduction(dto.getIntroduction())
                .nickname(dto.getNickname())
                .imageUrl(profileImage)
                .build();
        gatheringMemberRepository.save(gatheringMember);
        gathering.setMemberCount(gathering.getMemberCount() + 1);
        gatheringRepository.save(gathering);
    }

    @Transactional
    public void addToBlacklist(Long gatheringId, Long targetMemberId, Member m) {
        Gathering gathering = gatheringRepository.findById(gatheringId)
                .orElseThrow(() -> new IllegalArgumentException("소모임을 찾을 수 없습니다."));

        if (!gathering.getMember().getId().equals(m.getId())) {
            throw new IllegalArgumentException("리더만 블랙리스틀 관리할 수 있습니다.");
        }

        Member member = memberRepository.findById(targetMemberId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Blacklist blacklist = Blacklist.builder()
                .gathering(gathering)
                .member(member)
                .build();
        blacklistRepository.save(blacklist);
        gatheringMemberRepository.deleteByGatheringIdAndMemberId(gatheringId, targetMemberId);
        gathering.setMemberCount(gathering.getMemberCount() - 1);
        gatheringRepository.save(gathering);
    }

    @Transactional
    public void createPost(Long gatheringId, GatheringPostRequest request, Member member, List<MultipartFile> imageFiles) {
        Gathering gathering = gatheringRepository.findById(gatheringId)
                .orElseThrow(() -> new IllegalArgumentException("소모임을 찾을 수 없습니다."));

        if(!gatheringMemberRepository.findByGatheringIdAndMemberId(gatheringId, member.getId()).isPresent()) {
            throw new IllegalStateException("소모임 참여자만 게시글을 작성할 수 있습니다.");
        }

        if(request.getCategory() == GatheringPostCategory.NOTICE && !gathering.getMember().getId().equals(member.getId())) {
            throw new IllegalArgumentException("NOTICE 게시글은 리더만 작성할 수 있습니다.");
        }

        GatheringPost post = GatheringPost.builder()
                .gathering(gathering)
                .member(member)
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .build();
        gatheringPostRepository.save(post);

        if (imageFiles != null && !imageFiles.isEmpty()){
            for (MultipartFile imageFile  : imageFiles) {
                String imageUrl = imageService.saveImage(imageFile);

                if (imageUrl != null) {
                    PostImage image = PostImage.builder()
                            .imgUrl(imageUrl)
                            .gatheringPost(post)
                            .build();
                    postImageRepository.save(image);
                }
            }
        }
    }

    public List<GroupPostDto> getPosts(Long gatheringId) {
        return gatheringPostRepository.findByGatheringId(gatheringId)
                .stream()
                .map(post ->
                        GroupPostDto.builder()
                                .id(post.getId())
                                .username(post.getMember().getUsername())
                                .title(post.getTitle())
                                .content(post.getContent())
                                .category(post.getCategory())
                                .createdAt(post.getCreatedAt())
                                .updatedAt(post.getUpdatedAt())
                                .viewCount(post.getViewCount())
                                .likes((long) post.getLikes().stream().filter(like -> like.getGatheringPost() != null).count())
                                .imgUrls(post.getPostImages().stream().map(PostImage::getImgUrl).collect(Collectors.toList()))
                                .build())
                .collect(Collectors.toList());
    }

    public GroupPostDto detailPost(Long gatheringId, Long postId, Member member) {
        GatheringPost post = gatheringPostRepository.findByIdAndGathering_Id(postId, gatheringId);

        post.setViewCount(post.getViewCount() == null ? 1 : post.getViewCount() + 1);

        List<String> imageUrls = post.getPostImages().stream()
                .filter(img -> !img.getIsDeleted()) // 삭제된 이미지 제외 (optional)
                .map(PostImage::getImgUrl)
                .collect(Collectors.toList());

        return GroupPostDto.builder()
                .id(postId)
                .username(member.getUsername())
                .title(post.getTitle())
                .content(post.getContent())
                .category(post.getCategory())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .viewCount(post.getViewCount())
                .likes((long) post.getLikes().stream().filter(like -> like.getGatheringPost() != null).count())
                .imgUrls(imageUrls)
                .build();
    }

    public GroupPostDto editPost(Long gatheringId, Long postId, String title, String content, List<MultipartFile> imageFiles, Member m) {
        Gathering gathering = gatheringRepository.findById(gatheringId)
                .orElseThrow(() -> new IllegalArgumentException("소모임을 찾을 수 없습니다."));

        GatheringPost post = gatheringPostRepository.findByIdAndGathering_Id(postId, gatheringId);

        if (!post.getMember().getId().equals(m.getId())) {
            throw new IllegalArgumentException("작성자만 게시글을 수정할 수 있습니다.");
        }
            post.setTitle(title);
            post.setContent(content);
            gatheringPostRepository.save(post);

        if (imageFiles != null && !imageFiles.isEmpty()){
            for (MultipartFile imageFile  : imageFiles) {
                String imageUrl = imageService.saveImage(imageFile);

                if (imageUrl != null) {
                    PostImage image = PostImage.builder()
                            .imgUrl(imageUrl)
                            .gatheringPost(post)
                            .build();
                    postImageRepository.save(image);
                }
            }
        }

        return GroupPostDto.builder()
                .id(postId)
                .username(m.getUsername())
                .title(title)
                .content(content)
                .category(post.getCategory())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .viewCount(post.getViewCount())
                .likes((long) post.getLikes().stream().filter(like -> like.getGatheringPost() != null).count())
                .imgUrls(post.getPostImages().stream().map(PostImage::getImgUrl).collect(Collectors.toList()))
                .build();
    }





    @Transactional
    public void createPhoto(Long gatheringId, MultipartFile image, Member member) throws IOException {
        Gathering gathering = gatheringRepository.findById(gatheringId)
                .orElseThrow(() -> new IllegalArgumentException("소모임을 찾을 수 없습니다."));

        if (!gatheringMemberRepository.findByGatheringIdAndMemberId(gatheringId, member.getId()).isPresent()) {
            throw new IllegalStateException("소모임 참여자만 사진을 업로드할 수 있습니다.");
        }

        String imageUrl = imageService.saveGatheringImage(image, member.getEmail());
        GatheringPhoto photo = GatheringPhoto.builder()
                .gathering(gathering)
                .member(member)
                .imageUrl(imageUrl)
                .build();
        gatheringPhotoRepository.save(photo);
    }

    public List<GroupPhotoResponse> getPhotos(Long gatheringId) {
        return gatheringPhotoRepository.findByGatheringId(gatheringId)
                .stream()
                .map(photo -> {
                    GroupPhotoResponse dto = new GroupPhotoResponse(photo.getImageUrl());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 사용자 정보 확인
    public void validateMember (Member m){
        Member member = memberRepository.findById(m.getId())
                .orElseThrow(() -> new IllegalArgumentException("해당사용자가 존재하지 않습니다"));

        if (!member.getEmail().equals(m.getEmail())) {
            throw new AccessDeniedException("사용자 정보가 일치하지 않습니다.");
        }
    }

    private GatheringResponse convertToDto(Gathering g) {
        boolean liked = false; // 비로그인 조회이므로 기본 false
        return GatheringResponse.builder()
                .id(g.getId())
                .title(g.getTitle())
                .category(g.getCategory().name())
                .content(g.getContent())
                .dongName(g.getDongName())
                .titleImage(g.getTitleImage())
                .createdAt(g.getCreatedAt())
                .updatedAt(g.getUpdatedAt())
                .likes((long) g.getLikes().stream().filter(l -> l.getGathering() != null).count())
                .liked(liked)
                .memberCount(g.getMemberCount())
                .build();
    }

}
