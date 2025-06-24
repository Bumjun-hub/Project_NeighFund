package org.project.neighfund.domain.fund;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FundRepository extends JpaRepository<Fund, Long> {
}
