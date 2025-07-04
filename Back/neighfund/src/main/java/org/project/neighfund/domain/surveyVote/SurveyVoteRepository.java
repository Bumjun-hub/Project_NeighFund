package org.project.neighfund.domain.surveyVote;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface SurveyVoteRepository extends JpaRepository<SurveyVote, Long> {
    int countBySurveyId(Long id);

    List<SurveyVote> findByMemberId(Long memberId);

    boolean existsBySurveyIdAndMemberId(Long surveyId, Long id);
}
