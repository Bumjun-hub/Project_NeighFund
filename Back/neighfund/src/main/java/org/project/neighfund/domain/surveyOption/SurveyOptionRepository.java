package org.project.neighfund.domain.surveyOption;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyOptionRepository extends JpaRepository<SurveyOption, Long> {
}
