package org.project.neighfund.application.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.project.neighfund.enums.OrderStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDto {
    private Long id;

    private Long fundId;           //게시글
    private String fundTitle;

    private Long optionId;         //옵션
    private String optionTitle;
    private Long optionPrice;

    private String username;
    private Integer quantity;
    private Long totalAmount;
    private String address;
    private String phone;
    private String paymentName;  //입금자명(사용자)
    private String paymentBank;  //입금음행(사용자)
    private OrderStatus status;
}
