package org.project.neighfund.domain.surveyVote;

import jakarta.persistence.*;
import lombok.*;
import org.project.neighfund.domain.common.BaseEntity;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.survey.Survey;
import org.project.neighfund.domain.surveyOption.SurveyOption;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "survey_vote")
public class SurveyVote extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "option_id", nullable = false)
    private SurveyOption option;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;


}
