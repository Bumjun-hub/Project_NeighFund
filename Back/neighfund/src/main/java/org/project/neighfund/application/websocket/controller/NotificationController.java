package org.project.neighfund.application.websocket.controller;

import lombok.RequiredArgsConstructor;
import org.project.neighfund.application.websocket.service.NotificationService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
}
