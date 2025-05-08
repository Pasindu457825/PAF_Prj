package com.paf_grp.backend.repository.isuri;


import com.paf_grp.backend.model.isuri.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);
    Long countByRecipientEmailAndIsReadFalse(String recipientEmail);
}