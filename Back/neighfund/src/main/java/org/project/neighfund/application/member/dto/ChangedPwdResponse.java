package org.project.neighfund.application.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChangedPwdResponse {
    private String message;
    private String email;
}
