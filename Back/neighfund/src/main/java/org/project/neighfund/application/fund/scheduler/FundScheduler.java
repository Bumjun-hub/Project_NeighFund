package org.project.neighfund.application.fund.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.project.neighfund.application.fund.service.FundService;
import org.project.neighfund.domain.fund.Fund;
import org.project.neighfund.domain.fund.FundRepository;
import org.project.neighfund.enums.FundStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class FundScheduler {
    private final FundRepository fundRepository;
    private final FundService fundService;

    @Scheduled(fixedRate = 60000) // 1분
    @Transactional
    public void checkExpiredFunds() {
        log.info("마감된 펀드 체크 시작");
        List<Fund> expiredFunds = fundRepository
                .findByDeadlineBeforeAndFundStatus(LocalDateTime.now(), FundStatus.ONGOING);

            for (Fund fund : expiredFunds) {
                fundService.completedFund(fund.getId());
                log.info("마감 처리됨: 펀드 ID {}, 제목 {}", fund.getId(), fund.getTitle());
            }
        }
}

