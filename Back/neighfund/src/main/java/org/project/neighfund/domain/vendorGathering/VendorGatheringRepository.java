package org.project.neighfund.domain.vendorGathering;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorGatheringRepository extends JpaRepository<VendorGathering, Long> {
}
