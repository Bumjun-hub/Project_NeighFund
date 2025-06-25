package org.project.neighfund.domain.community;

import org.project.neighfund.enums.CommunityCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
    List<Community> findByCategoryOrderByCreatedAtDesc(CommunityCategory category);
}
