package org.project.neighfund.application.fund.service;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.domain.fund.FundRepository;
import org.project.neighfund.domain.member.MemberRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FundService {

    private final FundRepository fundRepository;
    private final MemberRepository memberRepository;

}
