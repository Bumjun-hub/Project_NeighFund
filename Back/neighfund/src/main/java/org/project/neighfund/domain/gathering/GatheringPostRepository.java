package org.project.neighfund.domain.gathering;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface GatheringPostRepository extends JpaRepository<GatheringPost, Long> {
    Collection<GatheringPost> findByGatheringId(Long gatheringId);

    GatheringPost findByIdAndGathering_Id(Long id, Long gatheringId);
}
