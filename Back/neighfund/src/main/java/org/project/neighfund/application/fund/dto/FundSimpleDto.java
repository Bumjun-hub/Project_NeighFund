// 관리자 페이지에서 이름만 가져오게 하기 위한 Dto

package org.project.neighfund.application.fund.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FundSimpleDto {
    private Long id;
    private String title;
}
