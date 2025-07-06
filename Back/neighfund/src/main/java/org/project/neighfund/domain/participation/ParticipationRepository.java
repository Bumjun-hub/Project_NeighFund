package org.project.neighfund.domain.participation;

import org.project.neighfund.application.Participation.dto.ParticipationResponseDto;
import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {

    boolean existsByFundAndMember(Fund fund, Member member);

    Optional<Participation> findByFundAndMember(Fund fund, Member loginUser);

    List<Participation> findAllByFund(Fund fund);

    List<Participation> findByMember(Member loginUser);

    List<Participation> findByFundId(Long fundId);
}
