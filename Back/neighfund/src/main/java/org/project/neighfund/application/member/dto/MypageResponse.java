package org.project.neighfund.application.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class MypageResponse {
    private String email;
    private String username;
    private String phone;
    private String address;
    private String dongName;
    private String imageUrl;
}
