package org.project.neighfund.application.comment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentUpdateRequest {
    private Long commentId;
    private String content;
}
