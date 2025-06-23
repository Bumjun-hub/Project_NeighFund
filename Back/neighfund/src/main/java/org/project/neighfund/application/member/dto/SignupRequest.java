package org.project.neighfund.application.member.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SignupRequest {
    private String email;
    private String password;
    private String confirmPassword;
    private String username;
    private String address;
    private String dongName;
    private String phone;
}
