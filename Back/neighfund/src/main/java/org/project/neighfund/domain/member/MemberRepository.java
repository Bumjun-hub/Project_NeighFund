package org.project.neighfund.domain.member;

import org.project.neighfund.enums.SocialProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String username);

    Optional<Member> findByEmailAndSocialProvider(String email, SocialProvider socialProvider);

    boolean existsByEmailAndSocialProvider(String email, SocialProvider socialProvider);

    boolean existsBySocialIdAndSocialProvider(String nameAttributeKey, SocialProvider socialProvider);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
