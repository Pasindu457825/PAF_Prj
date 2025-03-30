package com.paf_grp.backend.controller.pasindu.user_message;

import com.paf_grp.backend.model.pasindu.user_message.Message;
import com.paf_grp.backend.service.pasindu.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public Message sendMessage(@RequestBody Message message) {
        return messageService.sendMessage(message);
    }

    @GetMapping("/{groupId}")
    public List<Message> getMessagesByGroup(@PathVariable String groupId) {
        return messageService.getMessagesByGroupId(groupId);
    }
}
