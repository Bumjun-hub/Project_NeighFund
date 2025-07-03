package org.project.neighfund.application.vendorGathering.dto;

import lombok.*;
import org.project.neighfund.domain.like.Like;
import org.project.neighfund.domain.vendorGathering.ReservationSlot;
import org.project.neighfund.domain.vendorGathering.VendorGathering;
import org.project.neighfund.enums.GatheringCategory;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VendorDetailResponse {
    private long id;
    private String title;
    private GatheringCategory category;
    private String content;
    private String dongName;
    private String titleImage;
    private long productPrice;
    private String productName;
    private String freeParking;
    private String durationHours;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long likes;
    private List<VendorImageDto> images;
    private List<ReservationSlotDto> reservationSlots;
    private boolean liked;

}
