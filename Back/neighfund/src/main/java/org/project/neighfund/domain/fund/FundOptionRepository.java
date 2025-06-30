package org.project.neighfund.domain.fund;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FundOptionRepository extends JpaRepository<FundOption,Long> {
    void deleteByFund(Fund fund);

    List<FundOption> findByFund(Fund fund);
}
