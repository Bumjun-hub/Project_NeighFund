package org.project.neighfund.domain.fund;

import org.project.neighfund.domain.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FundRepository extends JpaRepository<Fund, Long> {
    List<Fund> findAllApprovedTrue();
}
