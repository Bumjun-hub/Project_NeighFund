package org.project.neighfund.domain.survey;

import jakarta.persistence.*;
import lombok.*;
import org.project.neighfund.domain.common.BaseEntity;
import org.project.neighfund.domain.surveyOption.SurveyOption;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Survey extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;    //설문조사제목

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SurveyOption> options;

    @Column(nullable = false)
    private boolean visible = false;   //설문조사 보이기, 숨기기

}
