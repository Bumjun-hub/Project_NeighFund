package org.project.neighfund.application.gathering.service;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.gathering.dto.GatheringDto;
import org.project.neighfund.application.gathering.dto.GatheringResponse;
import org.project.neighfund.application.gathering.dto.DeleteResponse;
import org.project.neighfund.domain.gathering.Gathering;
import org.project.neighfund.domain.gathering.GatheringRepository;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;
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

    public void createGathering(GatheringDto dto, MultipartFile file, Member m) throws IOException {
        validateMember(m);
        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new IllegalArgumentException("제목을 입력하세요");
        }
        if (dto.getContent() == null || dto.getContent().isBlank()) {
            throw new IllegalArgumentException("내용을 입력하세요");
        }

        String titleImage = imageService.saveGatheringImage(file, m.getEmail());

        Gathering gathering = Gathering.builder()
                .title(dto.getTitle())
                .category(dto.getCategory())
                .content(dto.getContent())
                .dongName(dto.getDongName())
                .titleImage(titleImage)
                .member(m)
                .build();

        gatheringRepository.save(gathering);
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
                .build();
    }

    public GatheringResponse editGathering(Long id, GatheringDto dto, MultipartFile file, Member m) {
        validateMember(m);

        Gathering gathering = gatheringRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 소모임 번호입니다."));

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
                .build();
    }
}
