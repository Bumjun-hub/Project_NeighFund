package org.project.neighfund.domain.gathering;

import org.project.neighfund.domain.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GatheringMemberRepository extends JpaRepository<GatheringMember, Long> {
    // 🔧 Object를 GatheringMember로 변경
    Optional<GatheringMember> findByGatheringIdAndMemberId(Long gatheringId, Long memberId);

    boolean existsByGatheringIdAndNickname(Long gatheringId, String nickname);

    void deleteByGatheringIdAndMemberId(Long gatheringId, Long targetMemberId);

    // 🆕 디버깅을 위한 메서드 추가 (선택사항)
    List<GatheringMember> findByGatheringId(Long gatheringId);

    List<GatheringMember> findByMember(Member member);
}