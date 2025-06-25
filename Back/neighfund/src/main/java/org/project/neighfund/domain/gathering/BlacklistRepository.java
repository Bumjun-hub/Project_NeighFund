package org.project.neighfund.domain.gathering;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlacklistRepository extends JpaRepository<Blacklist, Long> {
    boolean existsByGatheringIdAndMemberId(Long gatheringId, Long id);
}
