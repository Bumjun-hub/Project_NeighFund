package org.project.neighfund.application.fund.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.fund.service.FundService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/fund")
public class FundController {

    private final FundService fundService;

    //작성
    @PostMapping("/write")
    public ResponseEntity<String> createPost(
            @RequestPart("")
    )
}
