package org.project.neighfund.application.comment.service;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.comment.dto.*;

import org.project.neighfund.application.websocket.service.NotificationService;
import org.project.neighfund.domain.comment.Comment;
import org.project.neighfund.domain.comment.CommentRepository;
import org.project.neighfund.domain.community.Community;
import org.project.neighfund.domain.community.CommunityRepository;

import org.project.neighfund.domain.gathering.GatheringPost;
import org.project.neighfund.domain.gathering.GatheringPostRepository;

import org.project.neighfund.domain.member.Member;
import org.project.neighfund.domain.member.MemberRepository;
import org.project.neighfund.domain.vendorGathering.VendorGathering;
import org.project.neighfund.domain.vendorGathering.VendorGatheringRepository;
import org.project.neighfund.enums.CommentEntityType;
import org.project.neighfund.enums.NotificationType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static java.lang.Long.parseLong;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final CommunityRepository communityRepository;
    private final GatheringPostRepository gatheringPostRepository;
    private final VendorGatheringRepository vendorGatheringRepository;
    private final NotificationService notificationService;

    @Transactional
    public CommentResponse createComment(Member m, CommentRequest request) {
        if (request.getContent() == null) {
            throw new IllegalArgumentException("댓글 내용이 비어있습니다.");
        }

        validateMember(m);

        Comment comment = Comment.builder()
                .member(m)
                .content(request.getContent())
                .build();

        switch (request.getEntityType()) {
            case COMMUNITY:
                Long communityId = parseLong(request.getPostId());
                Community community = communityRepository.findById(communityId)
                        .orElseThrow(() -> new IllegalArgumentException("게시글 번호가 유효하지 않습니다."));
                comment.setCommunity(community);
                commentRepository.save(comment);

                if (m.getId().equals(community.getMember().getId())) {
                    String content = "🔔 \"" + community.getTitle() + "\" 게시물에 댓글이 등록되었습니다!";
                    notificationService.createAndSendNotification(
                            comment.getMember(),
                            NotificationType.COMMENT,
                            content,
                            community,
                            null,
                            null,
                            null
                    );
                }
                break;
            case GATHERING:
                Long gatheringPostId = parseLong(request.getPostId());
                GatheringPost post = gatheringPostRepository.findById(gatheringPostId)
                        .orElseThrow(() -> new IllegalArgumentException("소모임 게시글 번호가 유효하지 않습니다."));
                comment.setGatheringPost(post);
                commentRepository.save(comment);

                if (m.getId().equals(post.getMember().getId())) {
                    String content = "🔔 \"" + post.getTitle() + "\" 소모임 게시물에 댓글이 등록되었습니다!";
                    notificationService.createAndSendNotification(
                            comment.getMember(),
                            NotificationType.COMMENT,
                            content,
                            null,
                            post,
                            null,
                            null
                    );
                }
                break;
            case VENDOR:
                Long vendorGatheringId = parseLong(request.getPostId());
                VendorGathering vendor = vendorGatheringRepository.findById(vendorGatheringId)
                        .orElseThrow(() -> new IllegalArgumentException("원데이클래스 게시글 번호가 유효하지 않습니다."));
                comment.setVendorGathering(vendor);
                commentRepository.save(comment);

                if (m.getId().equals(vendor.getMember().getId())) {
                    String content = "🔔 \"" + vendor.getTitle() + "\" 원데이클래스에 댓글이 등록되었습니다!";
                    notificationService.createAndSendNotification(
                            comment.getMember(),
                            NotificationType.COMMENT,
                            content,
                            null,
                            null,
                            vendor,
                            null
                    );
                }
                break;
            default:
                throw new IllegalArgumentException("게시글 타입이 유효하지 않습니다" + request.getEntityType());
        }

        return CommentResponse.builder()
                .id(comment.getId())
                .entityType(request.getEntityType())
                .postId(request.getPostId())
                .content(comment.getContent())
                .username(m.getUsername())
                .createdAt(comment.getCreatedAt())
                .build();
    }


    @Transactional
    public void deleteComment(Member m, Long commentId) {
        validateMember(m);

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("작성된 댓글이 없습니다."));
        if (!comment.getMember().getId().equals(m.getId())) {
            throw new IllegalArgumentException("댓글 작성자만 삭제가 가능합니다.");
        }
        comment.setIsDeleted(true);
        commentRepository.save(comment);
    }


    public CommentUpdateResponse updateComment(Member m, CommentUpdateRequest request) {
        validateMember(m);
        if (request.getContent() == null) {
            throw new IllegalArgumentException("댓글 내용이 비어있습니다.");
        }

        Comment comment = commentRepository.findById(request.getCommentId())
                .orElseThrow(() -> new IllegalArgumentException("작성된 댓글이 없습니다."));
        if (!comment.getMember().getId().equals(m.getId())) {
            throw new IllegalArgumentException("댓글 작성자만 수정이 가능합니다.");
        }
        if (comment.getIsDeleted()) {
            throw new IllegalArgumentException("삭제된 댓글을 수정할 수 없습니다.");
        }
        comment.setContent(request.getContent());
        commentRepository.save(comment);

        return CommentUpdateResponse.builder()
                .commentId(comment.getId())
                .content(comment.getContent())
                .username(m.getUsername())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<CommentListResponse> getListComment(CommentEntityType entityType, String postId) {
        List<Comment> commentList;
        switch (entityType) {
            case COMMUNITY:
                Long communityId = parseLong(postId);
                commentList = commentRepository.findByCommunity_IdAndIsDeletedFalse(communityId);
                break;
            case GATHERING:
                Long gatheringpostId = parseLong(postId);
                commentList = commentRepository.findByGatheringPost_IdAndIsDeletedFalse(gatheringpostId);
                break;
            case VENDOR:
                Long vendorId = parseLong(postId);
                commentList = commentRepository.findByVendorGathering_IdAndIsDeletedFalse(vendorId);
                break;
            default:
                throw new IllegalArgumentException("게시글 타입이 유효하지 않습니다" + entityType);
        }
        return commentList.stream()
                .map(comment -> CommentListResponse.builder()
                        .id(comment.getId())
                        .entityType(entityType)
                        .postId(postId)
                        .content(comment.getContent())
                        .username(comment.getMember().getUsername())
                        .createdAt(comment.getCreatedAt())
                        .profileImage(comment.getMember().getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }

    // 사용자 정보 확인
    public void validateMember (Member m){
        Member member = memberRepository.findById(m.getId())
                .orElseThrow(() -> new IllegalArgumentException("해당사용자가 존재하지 않습니다"));

        if (!member.getEmail().equals(m.getEmail())) {
            throw new AccessDeniedException("사용자 정보가 일치하지 않습니다.");
        }
    }
}
