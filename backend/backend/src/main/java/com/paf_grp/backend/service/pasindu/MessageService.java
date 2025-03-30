package com.paf_grp.backend.service.pasindu;

import com.paf_grp.backend.model.pasindu.user_group.Group;
import com.paf_grp.backend.model.pasindu.user_message.Message;
import com.paf_grp.backend.repository.pasindu.GroupRepository;
import com.paf_grp.backend.repository.pasindu.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private GroupRepository groupRepository; // ✅ Needed to fetch group name

    public Message sendMessage(Message message) {
        // ✅ Fetch group and set group name
        Group group = groupRepository.findById(message.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        message.setGroupName(group.getName());

        return messageRepository.save(message);
    }

    public List<Message> getMessagesByGroupId(String groupId) {
        return messageRepository.findByGroupIdOrderByTimestampAsc(groupId);
    }
}
