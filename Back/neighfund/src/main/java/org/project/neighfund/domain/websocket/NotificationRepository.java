package org.project.neighfund.domain.websocket;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByMemberId(Long id);

    Long countByMemberIdAndIsReadFalse(Long id);
}
