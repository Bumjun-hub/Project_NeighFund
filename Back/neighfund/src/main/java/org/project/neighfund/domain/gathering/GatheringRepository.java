package org.project.neighfund.domain.gathering;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GatheringRepository extends JpaRepository<Gathering, Long> {
}
