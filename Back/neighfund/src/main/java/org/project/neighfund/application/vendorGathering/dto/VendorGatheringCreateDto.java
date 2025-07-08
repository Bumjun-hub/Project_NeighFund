package org.project.neighfund.application.vendorGathering.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.project.neighfund.enums.GatheringCategory;
import org.project.neighfund.enums.GatheringType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VendorGatheringCreateDto {
    private String title;
    private GatheringCategory category;
    private GatheringType type;
    private String content;
    private String dongName;
    private String productName;
    private int maxParticipants;
    private Long productPrice;

}
