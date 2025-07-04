package org.project.neighfund.application.like.service;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.domain.community.Community;
import org.project.neighfund.domain.community.CommunityRepository;
import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.fund.FundRepository;
import org.project.neighfund.domain.gathering.Gathering;
import org.project.neighfund.domain.gathering.GatheringRepository;
import org.project.neighfund.domain.like.Like;
import org.project.neighfund.domain.like.LikeRepository;
import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;
import org.project.neighfund.domain.vendorGathering.VendorGathering;
import org.project.neighfund.domain.vendorGathering.VendorGatheringRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final MemberRepository memberRepository;
    private final CommunityRepository communityRepository;
    private final FundRepository fundRepository;
    private final GatheringRepository gatheringRepository;
    private final VendorGatheringRepository vendorGatheringRepository;

    @Transactional
    public void toggleLike(Member m, String type, Long postId) {
        Member member = memberRepository.findByEmail(m.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("유저 정보를 찾을 수 없습니다."));

        switch (type.toUpperCase()) {
            case "COMMUNITY":
                Community community = communityRepository.findById(postId)
                        .orElseThrow(() -> new IllegalArgumentException("없는 커뮤니티 글 번호 입니다."));
                if (likeRepository.existsByMember_IdAndCommunity_Id(m.getId(), community.getId())) {
                    likeRepository.deleteByMember_IdAndCommunity_Id(m.getId(), community.getId());
                }  else {
                    Like like = Like.builder()
                            .member(m)
                            .community(community)
                            .build();
                    likeRepository.save(like);
                }
                break;
            case "FUND" :
                Fund fund = fundRepository.findById(postId)
                        .orElseThrow(() -> new IllegalArgumentException("없는 Fund 글 번호 입니다."));
                if(likeRepository.existsByMember_IdAndFund_Id(m.getId(), fund.getId())) {
                    likeRepository.deleteByMember_IdAndFund_Id(m.getId(), fund.getId());
                } else {
                    Like like = Like.builder()
                            .member(m)
                            .fund(fund)
                            .build();
                    likeRepository.save(like);
                }
                break;
            case "GATHERING" :
                Gathering gathering = gatheringRepository.findById(postId)
                        .orElseThrow(() -> new IllegalArgumentException("없는 소모임 글 번호 입니다."));
                if(likeRepository.existsByMember_IdAndGathering_Id(m.getId(), gathering.getId())) {
                    likeRepository.deleteByMember_IdAndGathering_Id(m.getId(), gathering.getId());
                } else {
                    Like like = Like.builder()
                            .member(m)
                            .gathering(gathering)
                            .build();
                    likeRepository.save(like);
                }
                break;
            case "VENDOR" :
                VendorGathering vendor = vendorGatheringRepository.findById(postId)
                        .orElseThrow(() -> new IllegalArgumentException("없는 소모임 글 번호 입니다."));
                if(likeRepository.existsByMember_IdAndVendorGathering_Id(m.getId(), vendor.getId())) {
                    likeRepository.deleteByMember_IdAndVendorGathering_Id(m.getId(), vendor.getId());
                } else {
                    Like like = Like.builder()
                            .member(m)
                            .vendorGathering(vendor)
                            .build();
                    likeRepository.save(like);
                }
                break;
            default: throw new IllegalArgumentException("Invalid entityType: " + type);
        }
    }

    @Transactional
    public long getLikeCount(String type, Long postId) {
        switch (type.toUpperCase()) {
            case "COMMUNITY":
                return likeRepository.countByCommunity_Id(postId);
            case "FUND":
                return likeRepository.countByFund_Id(postId);
            case "GATHERING":
                return likeRepository.countByGathering_Id(postId);
            case "VENDOR":
                return likeRepository.countByVendorGathering_Id(postId);
            default:
                throw new IllegalArgumentException("Invalid entityType: " + type);
        }
    }
}
