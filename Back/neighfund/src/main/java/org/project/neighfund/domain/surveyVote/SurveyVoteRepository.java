package org.project.neighfund.domain.surveyVote;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyVoteRepository extends JpaRepository<SurveyVote, Long> {
}
