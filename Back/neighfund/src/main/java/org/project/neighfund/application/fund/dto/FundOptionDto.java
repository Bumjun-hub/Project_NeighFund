package org.project.neighfund.application.fund.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundOptionDto {

    private Long id;
    private String title;
    private String description;
    private Long amount;
    private Long price;
    private String content;
    private Integer quantity;

}
