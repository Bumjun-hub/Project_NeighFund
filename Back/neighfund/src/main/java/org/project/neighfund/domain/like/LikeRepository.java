package org.project.neighfund.domain.like;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByMember_IdAndCommunity_Id(Long id, Long id1);

    void deleteByMember_IdAndCommunity_Id(Long id, Long id1);

    boolean existsByMember_IdAndFund_Id(Long id, Long id1);

    boolean existsByMember_IdAndGathering_Id(Long id, Long id1);

    long countByCommunity_Id(Long postId);

    long countByFund_Id(Long postId);

    long countByGathering_Id(Long postId);

    long countByVendorGathering_Id(Long postId);

    boolean existsByMember_IdAndVendorGathering_Id(Long id, Long id1);

    void deleteByMember_IdAndFund_Id(Long id, Long id1);

    void deleteByMember_IdAndGathering_Id(Long id, Long id1);

    void deleteByMember_IdAndVendorGathering_Id(Long id, Long id1);
}
