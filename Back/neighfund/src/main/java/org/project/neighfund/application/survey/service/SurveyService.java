package org.project.neighfund.application.survey.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.survey.dto.SurveyDto;
import org.project.neighfund.application.survey.dto.SurveyOptionResponseDto;
import org.project.neighfund.application.survey.dto.SurveyResponseDto;
import org.project.neighfund.application.survey.dto.SurveyUserResponseDto;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;
import org.project.neighfund.domain.survey.Survey;
import org.project.neighfund.domain.survey.SurveyRepository;
import org.project.neighfund.domain.surveyOption.SurveyOption;
import org.project.neighfund.domain.surveyOption.SurveyOptionRepository;
import org.project.neighfund.domain.surveyVote.SurveyVote;
import org.project.neighfund.domain.surveyVote.SurveyVoteRepository;
import org.project.neighfund.enums.RoleName;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyRepository surveyRepository;
    private final MemberRepository memberRepository;
    private final SurveyVoteRepository surveyVoteRepository;
    private final SurveyOptionRepository surveyOptionRepository;

    //설문생성
    @Transactional
    public void createPost(SurveyDto surveyDto, Member loginUser) {
        validateAdmin(loginUser);

        Survey survey = Survey.builder()
                .title(surveyDto.getTitle())
                .visible(false)
                .build();

        List<SurveyOption> options = surveyDto.getOptions().stream()
                .map(content -> SurveyOption.builder()
                                .content(content)
                                .survey(survey)
                                .build())
                .toList();
        survey.setOptions(options);
        surveyRepository.save(survey);

    }

    //설문삭제
    @Transactional
    public void deletePost(Long id, Member loginUser) {
        validateAdmin(loginUser);
        Survey survey = validatePost(id);
        surveyRepository.delete(survey);
    }

    //설문상태변경
    @Transactional
    public void statusPost(Long id, boolean visible, Member loginUser) {
        validateAdmin(loginUser);
        Survey survey = validatePost(id);

        survey.setVisible(visible);
    }

    //설문 + 총인원
    @Transactional
    public List<SurveyResponseDto> viewAll(Member loginUser) {
        validateAdmin(loginUser);
        return surveyRepository.findAll().stream()
                .map(survey -> SurveyResponseDto.builder()
                        .surveyId(survey.getId())
                        .title(survey.getTitle())
                        .createdAt(survey.getCreatedAt())
                        .visible(survey.isVisible())
                        .totalVotes(surveyVoteRepository.countBySurveyId(survey.getId()))
                        .build())
                .toList();
    }

    //설문보기(사용자)
    @Transactional
    public List<SurveyUserResponseDto> viewPost(Member user) {
        validateMember(user);
        List<Survey> surveys = surveyRepository.findByVisibleTrueOrderByCreatedAtDesc();

        Map<Long, Long> myVotes = (user == null) ? Map.of() : surveyVoteRepository.findByMemberId(user.getId())
                .stream().collect(Collectors.toMap(surveyVote -> surveyVote.getSurvey().getId(),
                        v -> v.getOption().getId()));

        return surveys.stream().map(survey ->{
                Long picked = myVotes.get(survey.getId());
                boolean voted = (picked != null);

                //총투표자
                int total = survey.getOptions().stream()
                        .mapToInt(SurveyOption::getVoteCount)
                        .sum();

                //옵션
                List<SurveyOptionResponseDto> optionDtos =
                        survey.getOptions().stream()
                                .map(options -> SurveyOptionResponseDto.builder()
                                        .optionId(options.getId())
                                        .content(options.getContent())
                                        .voteCount(voted ? options.getVoteCount() : 0)
                                        .selected(voted && options.getId().equals(picked))
                                        .build())
                                .toList();

                //설문
                return SurveyUserResponseDto.builder()
                        .surveyId(survey.getId())
                        .title(survey.getTitle())
                        .options(optionDtos)
                        .totalCount(voted ? total : 0)
                        .voted(voted)
                        .build();
                }).toList();
    }

    //투표하기(id당 1개)
    @Transactional
    public void votePost(Long surveyId, Long optionId, Member loginUser) {
        validateMember(loginUser);

        //중복투표확잉ㄴ
        boolean already = surveyVoteRepository.existsBySurveyIdAndMemberId(surveyId, loginUser.getId());
        if (already){
            throw new IllegalArgumentException("이미 참여한 설문입니다");
        }
        //옵션조회, 매칭확인
        SurveyOption option = surveyOptionRepository.findById(optionId)
                .orElseThrow(() -> new IllegalArgumentException("항목이 없습니다"));

        if (!option.getSurvey().getId().equals(surveyId)) {
            throw new IllegalArgumentException("해당 설문에 속한 항목이 아닙니다");
        }
        if (!option.getSurvey().isVisible()) {
            throw new AccessDeniedException("투표할 수 없는 설문입니다");
        }

        //득표수 +1
        option.setVoteCount(option.getVoteCount() + 1);

        //투표레코드 저장
        SurveyVote vote = SurveyVote.builder()
                .survey(option.getSurvey())
                .option(option)
                .member(loginUser)
                .build();
        surveyVoteRepository.save(vote);
    }

    //관리자확인
    public void validateAdmin(Member loginUser) {
        if (loginUser == null) {
            throw new AccessDeniedException("로그인이 필요합니다");
        }
        if (loginUser.getRole().getName() != RoleName.ROLE_ADMIN) {
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        }
    }

    //사용자확인
    public void validateMember(Member loginUser) {
      /*  if (loginUser == null){
            throw new AccessDeniedException("로그인이 필요합니다");
        }*/
        Member foundMember = memberRepository.findById(loginUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("해당사용자가 존재하지 않습니다"));

        if (!foundMember.getEmail().equals(loginUser.getEmail())) {
            throw new AccessDeniedException("사용자 정보가 일치하지 않습니다.");
        }
    }

    //글존재유무확인
    public Survey validatePost (Long id){
        return surveyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다"));
    }



}
