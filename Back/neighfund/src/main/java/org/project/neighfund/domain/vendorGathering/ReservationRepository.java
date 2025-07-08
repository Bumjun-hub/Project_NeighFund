package org.project.neighfund.domain.vendorGathering;

import org.project.neighfund.application.vendorGathering.dto.ReservationResponseDto;
import org.project.neighfund.domain.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByMember(Member loginUSer);
}
