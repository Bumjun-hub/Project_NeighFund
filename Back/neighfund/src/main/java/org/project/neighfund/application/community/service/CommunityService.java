package org.project.neighfund.application.community.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.community.dto.CommunityDto;
import org.project.neighfund.application.community.dto.CommunityResponseDto;
import org.project.neighfund.application.community.dto.CommunityStatusDto;
import org.project.neighfund.config.CustomUserDetails;
import org.project.neighfund.domain.community.Community;
import org.project.neighfund.domain.community.CommunityRepository;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;
import org.project.neighfund.enums.CommunityCategory;
import org.project.neighfund.enums.CommunityStatus;
import org.project.neighfund.enums.RoleName;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final MemberRepository memberRepository;

    //작성
    @Transactional
    public void createPost(CommunityDto communityDto, Member loginUser) {
        validateMember(loginUser);
        validateCreate(communityDto);
        Community community = Community.builder()
                .member(loginUser)
                .category(communityDto.getCategory())
                .status(CommunityStatus.RECRUITING)
                .title(communityDto.getTitle())
                .content(communityDto.getContent())
                .build();
        communityRepository.save(community);
    }

    //수정
    @Transactional
    public void editPost(Long id, CommunityDto communityDto, Member loginUser) {
        Community community = validatePost(id);
        validateMember(loginUser, community.getMember());
        validateCreate(communityDto);

        community.setCategory(communityDto.getCategory());
        community.setTitle(communityDto.getTitle());
        community.setContent(communityDto.getContent());
    }

    //삭제
    @Transactional
    public void deletePost(Long id, Member loginUser) {
        Community community = validatePost(id);
        validateMember(loginUser, community.getMember());

        communityRepository.delete(community);
    }

    @Transactional
    public List<CommunityResponseDto> viewAll(Member loginUser) {
        List<Community> communities = communityRepository.findAllByOrderByCreatedAtDesc();

        return communities.stream().map(post -> {
            if (post.getStatus() == CommunityStatus.RECRUITING && post.getLikes().size() >= 50) {
                post.setStatus(CommunityStatus.FUNDED);
            }

            boolean liked = false;
            if (loginUser != null && loginUser.getId() != null) {
                liked = post.getLikes().stream()
                        .filter(like -> like.getCommunity() != null && like.getMember() != null)
                        .anyMatch(like -> like.getMember().getId().equals(loginUser.getId()));
            }

            // 🛡️ 여기서 member가 null인지 체크하고 처리
            String username = (post.getMember() != null) ? post.getMember().getUsername() : "알 수 없음";

            return new CommunityResponseDto(
                    post.getId(),
                    username,
                    post.getCategory().name(),
                    post.getStatus().name(),
                    post.getTitle(),
                    post.getContent(),
                    post.getCreatedAt(),
                    post.getUpdatedAt(),
                    (long) post.getLikes().stream().filter(like -> like.getCommunity() != null).count(),
                    liked
            );
        }).collect(Collectors.toList());
    }




    //카테고리 조회
    @Transactional
    public List<CommunityResponseDto> viewPost(CommunityCategory category, Member loginUser) {
        List<Community> communities = communityRepository.findByCategoryOrderByCreatedAtDesc(category);


        // 좋아요 + 상세보기
        return communities.stream().map(post -> {
            //일정갯수 상태전환
            if(post.getStatus() == CommunityStatus.RECRUITING && post.getLikes().size() >= 50){
                post.setStatus(CommunityStatus.FUNDED);
            }

            boolean liked = false;
            if (loginUser != null && loginUser.getId() != null) {
                liked = post.getLikes().stream()
                        .filter(like -> like.getCommunity() != null && like.getMember() != null)
                        .anyMatch(like -> like.getMember().getId().equals(loginUser.getId()));
            }
            return new CommunityResponseDto(
                    post.getId(),
                    post.getMember().getUsername(),
                    post.getCategory().name(),
                    post.getStatus().name(),
                    post.getTitle(),
                    post.getContent(),
                    post.getCreatedAt(),
                    post.getUpdatedAt(),
                    (long) post.getLikes().stream().filter(like -> like.getCommunity() != null).count(),
                    liked
            );
        }).collect(Collectors.toList());
    }

    //관리자가 상태변경
    @Transactional
    public void updateStatus(Long id, CommunityStatusDto statusDto, Member loginUser) {
        Community post = validatePost(id);
        if (!loginUser.getRole().equals(RoleName.ROLE_ADMIN)) {
            throw new AccessDeniedException("관리자만 상태를 변경할 수 있습니다.");
        }
        post.setStatus(statusDto.getStatus());
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
    public void validateCreate (CommunityDto communityDto){
        if (communityDto.getTitle() == null || communityDto.getTitle().isBlank()) {
            throw new IllegalArgumentException("제목을 입력하세요");
        }
        if (communityDto.getContent() == null || communityDto.getContent().isBlank()) {
            throw new IllegalArgumentException("내용을 입력하세요");
        }
    }

    //작성자확인
    public void validateMember (Member loginUser, Member writer){
        if (!loginUser.getId().equals(writer.getId())) {
            throw new AccessDeniedException("작성자만 가능합니다");
        }
    }

    //글존재유무확인
    public Community validatePost (Long id){
        return communityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다"));
    }



}
