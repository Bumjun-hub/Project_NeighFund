package org.project.neighfund.domain.gathering;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GatheringMemberRepository extends JpaRepository<GatheringMember, Long> {
    Optional<Object> findByGatheringIdAndMemberId(Long gatheringId, Long id);

    boolean existsByGatheringIdAndNickname(Long gatheringId, String nickname);

    void deleteByGatheringIdAndMemberId(Long gatheringId, Long targetMemberId);
}
