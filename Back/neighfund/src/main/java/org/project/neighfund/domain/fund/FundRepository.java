package org.project.neighfund.domain.fund;

import org.project.neighfund.domain.member.Member;
import org.project.neighfund.enums.FundStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FundRepository extends JpaRepository<Fund, Long> {
    List<Fund> findAllByIsApprovedTrue();

    List<Fund> findByIsApprovedFalse();

    Optional<Fund> findByIdAndIsApprovedTrue(Long id);

    List<Fund> findByDeadlineBeforeAndFundStatus(LocalDateTime now, FundStatus fundStatus);

    List<Fund> findByIsDeletedFalse();

    Optional<Fund> findByIdAndIsDeletedFalse(Long id);

}
