package org.project.neighfund.domain.vendorGathering;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ReservationSlotRepository extends JpaRepository<ReservationSlot, Long> {
    Optional<ReservationSlot> findByVendorGatheringAndStartTime(VendorGathering gathering, LocalDateTime start);
}
