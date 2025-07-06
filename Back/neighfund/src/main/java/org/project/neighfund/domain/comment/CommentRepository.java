package org.project.neighfund.domain.comment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByCommunity_IdAndIsDeletedFalse(Long communityId);

    List<Comment> findByGatheringPost_IdAndIsDeletedFalse(Long gatheringpostId);

    List<Comment> findByVendorGathering_IdAndIsDeletedFalse(Long vendorId);
}
