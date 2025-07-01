package org.project.neighfund.application.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class ChangedPwdRequest {
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;
}
