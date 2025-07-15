package org.project.neighfund.application.vendorGathering.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorGatheringAdminResponseDto {
    private Long id;
    private String title;
    private String description;
    private String category;
    private Integer maxParticipants;
    private Integer duration; // 분 단위
    private Long  price;
    private String location;
    private String vendorName;
    private String vendorContact;
    private String vendorEmail;
    private String materials;
    private String requirements;
    private String status; // PENDING, APPROVED, REJECTED
    private LocalDateTime submittedAt;
    private String vendorExperience;
}
