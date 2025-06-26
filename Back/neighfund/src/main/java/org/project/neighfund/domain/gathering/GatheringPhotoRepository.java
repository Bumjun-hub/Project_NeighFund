package org.project.neighfund.domain.gathering;

import org.hibernate.sql.ast.tree.expression.JdbcParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface GatheringPhotoRepository extends JpaRepository<GatheringPhoto, Long> {
    List<GatheringPhoto> findByGatheringId(Long gatheringId);
}
