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
        boolean isMember = false; // 🆕 멤버 여부 변수 선언

        if (m != null && m.getId() != null) {
            System.out.println("=== 멤버십 확인 디버그 ===");
            System.out.println("현재 사용자 ID: " + m.getId());
            System.out.println("현재 사용자 Username: " + m.getUsername());
            System.out.println("현재 사용자 Email: " + m.getEmail());
            System.out.println("소모임 ID: " + gatheringId);
            System.out.println("소모임 제목: " + gathering.getTitle());

            liked = gathering.getLikes().stream()
                    .filter(like -> like.getGathering() != null && like.getMember() != null)
                    .anyMatch(like -> like.getMember().getId().equals(m.getId()));

            // 멤버십 확인 - try-catch로 안전하게 처리
            try {
                boolean memberExists = gatheringMemberRepository.findByGatheringIdAndMemberId(gatheringId, m.getId()).isPresent();
                System.out.println("gathering_member 테이블에서 멤버 존재 여부: " + memberExists);
                isMember = memberExists;
            } catch (Exception e) {
                System.out.println("멤버십 확인 중 에러: " + e.getMessage());
                e.printStackTrace();
                isMember = false;
            }

            // 추가 디버깅: 해당 소모임의 모든 멤버 출력
            try {
                List<GatheringMember> allMembers = gatheringMemberRepository.findByGatheringId(gatheringId);
                System.out.println("소모임의 전체 멤버 수: " + allMembers.size());
                for (GatheringMember member : allMembers) {
                    System.out.println("- 멤버 ID: " + member.getMember().getId() +
                            ", Username: " + member.getMember().getUsername() +
                            ", Role: " + member.getRole());
                }

                // 현재 사용자가 목록에 있는지 직접 확인
                boolean foundInList = allMembers.stream()
                        .anyMatch(gm -> gm.getMember().getId().equals(m.getId()));
                System.out.println("멤버 목록에서 현재 사용자 발견: " + foundInList);

            } catch (Exception e) {
                System.out.println("전체 멤버 조회 중 에러: " + e.getMessage());
                e.printStackTrace();
            }

            System.out.println("최종 isMember 결과: " + isMember);
            System.out.println("========================");

        } else {
            System.out.println("=== 멤버십 확인 디버그 ===");
            System.out.println("사용자가 null이거나 ID가 null입니다.");
            System.out.println("m: " + m);
            if (m != null) {
                System.out.println("m.getId(): " + m.getId());
            }
            System.out.println("========================");
        }

        // 🆕 참여자 정보 조회 및 DTO 변환 추가
        List<GatheringMember> gatheringMembers = gatheringMemberRepository.findByGatheringId(gatheringId);
        List<MemberInfo> memberInfos = gatheringMembers.stream()
                .map(gm -> MemberInfo.builder()
                        .id(gm.getId())
                        .nickname(gm.getNickname())
                        .introduction(gm.getIntroduction())
                        .imageUrl(gm.getImageUrl())
                        .role(gm.getRole().toString()) // GatheringRole enum을 String으로
                        .joinedAt(gm.getCreatedAt())
                        .build())
                .sorted((a, b) -> {
                    // 리더를 먼저 정렬
                    if ("LEADER".equals(a.getRole()) && !"LEADER".equals(b.getRole())) return -1;
                    if (!"LEADER".equals(a.getRole()) && "LEADER".equals(b.getRole())) return 1;
                    return a.getJoinedAt().compareTo(b.getJoinedAt());
                })
                .collect(Collectors.toList());

        System.out.println("🔍 참여자 정보 변환 완료: " + memberInfos.size() + "명");

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
                .isMember(isMember)
                .members(memberInfos) // 🆕 참여자 정보 추가
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
        boolean isMember = false; // 🆕 멤버 여부 변수 추가

        if (m != null && m.getId() != null) {
            liked = gathering.getLikes().stream()
                    .filter(like -> like.getGathering() != null && like.getMember() != null)
                    .anyMatch(like -> like.getMember().getId().equals(m.getId()));

            // 🆕 멤버십 확인 로직 추가
            isMember = gatheringMemberRepository.findByGatheringIdAndMemberId(id, m.getId()).isPresent();
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
                .isMember(isMember) // 🔧 isMember 필드 추가
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

        // 🆕 참여자 정보 조회 (목록에서도 참여자 정보를 보여주고 싶다면)
        List<GatheringMember> gatheringMembers = gatheringMemberRepository.findByGatheringId(g.getId());
        List<MemberInfo> memberInfos = gatheringMembers.stream()
                .map(gm -> MemberInfo.builder()
                        .id(gm.getId())
                        .nickname(gm.getNickname())
                        .introduction(gm.getIntroduction())
                        .imageUrl(gm.getImageUrl())
                        .role(gm.getRole().toString())
                        .joinedAt(gm.getCreatedAt())
                        .build())
                .sorted((a, b) -> {
                    // 리더를 먼저 정렬
                    if ("LEADER".equals(a.getRole()) && !"LEADER".equals(b.getRole())) return -1;
                    if (!"LEADER".equals(a.getRole()) && "LEADER".equals(b.getRole())) return 1;
                    return a.getJoinedAt().compareTo(b.getJoinedAt());
                })
                .collect(Collectors.toList());

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
                .isMember(false) // 🔧 비로그인 조회이므로 항상 false
                .members(memberInfos) // 🆕 참여자 정보 추가
                .build();
    }

    public List<MemberInfo> getGatheringMembers(Long gatheringId) {
        List<GatheringMember> members = gatheringMemberRepository.findByGatheringId(gatheringId);
        return members.stream()
                .map(gm -> MemberInfo.builder()
                        .id(gm.getMember().getId())
                        .nickname(gm.getNickname()) // ← 이걸 사용
                        .introduction(gm.getIntroduction())
                        .imageUrl(gm.getImageUrl())
                        .role(String.valueOf(gm.getRole()))
                        .joinedAt(gm.getCreatedAt())
                        .build())
                .toList();
    }

    public List<GatheringResponse> findMyParticipation(Member member) {
        // 내가 참여중인 GatheringMember 리스트 조회
        List<GatheringMember> myMemberships = gatheringMemberRepository.findByMember(member);

        // GatheringMember → GatheringResponse로 변환 (fromEntity 절대 사용 X)
        return myMemberships.stream()
                .map(gm -> {
                    Gathering g = gm.getGathering();
                    return GatheringResponse.builder()
                            .id(g.getId())
                            .title(g.getTitle())
                            .category(g.getCategory().name()) // ← .name() 붙이면 enum을 문자열로 바꿔줌
                            .dongName(g.getDongName())
                            .content(g.getContent())
                            .introduction(gm.getIntroduction())
                            .nickname(gm.getNickname())      // 내 소모임 닉네임(gm에서)
                            .type(g.getType().name())
                            .createdAt(g.getCreatedAt())
                            .updatedAt(g.getUpdatedAt())
                            // 필요한 필드 추가 가능!
                            .build();
                })
                .toList();
    }





}