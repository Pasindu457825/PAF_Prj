package com.paf_grp.backend.controller.isuri;



import com.paf_grp.backend.model.isuri.Notification;
import com.paf_grp.backend.repository.isuri.NotificationRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public List<Notification> getUserNotifications(@NotNull Authentication authentication) {
        String userEmail = authentication.getName();
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(userEmail);
    }

    @GetMapping("/unread-count")
    public Long getUnreadCount(Authentication authentication) {
        String userEmail = authentication.getName();
        return notificationRepository.countByRecipientEmailAndIsReadFalse(userEmail);
    }

    @PutMapping("/{id}/mark-as-read")
    public ResponseEntity<Notification> markAsRead(@PathVariable String id) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    notification.setRead(true);
                    return ResponseEntity.ok(notificationRepository.save(notification));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}