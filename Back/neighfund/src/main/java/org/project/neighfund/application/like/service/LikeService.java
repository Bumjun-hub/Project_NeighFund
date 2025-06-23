package org.project.neighfund.application.like.service;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.domain.like.LikeRepository;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final MemberRepository memberRepository;

    public void toggleLike(Member m, String type, Long postId) {
    }

    public long getLikeCount(String type, Long postId) {
        return 0;
    }
}
