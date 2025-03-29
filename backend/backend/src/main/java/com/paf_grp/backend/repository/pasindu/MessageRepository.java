package com.paf_grp.backend.repository.pasindu;

import com.paf_grp.backend.model.pasindu.user_message.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByGroupIdOrderByTimestampAsc(String groupId);
}
