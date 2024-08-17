package com.example.homewalk.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.example.homewalk.entity.ChatMessage;

@Controller
public class ChatController {

	@MessageMapping("/chat.sendMessage.{familyId}") // 클라이언트가 /app/chat.sendMessage로 보내는 메시지를 처리
    @SendTo("/topic/family/{familyId}") // 결과를 /topic/public으로 전송하여 해당 주제를 구독한 모든 클라이언트에게 전송
    public ChatMessage sendMessage(@DestinationVariable String familyId, ChatMessage chatMessage) {
		if (chatMessage.getType() == ChatMessage.MessageType.LEAVE) {
            chatMessage.setContent(chatMessage.getSender() + " has left the chat");
        }
        return chatMessage;
    }

    @MessageMapping("/chat.addUser.{familyId}")
    @SendTo("/topic/family/{familyId}")
    public ChatMessage addUser(@DestinationVariable String familyId, ChatMessage chatMessage) {
        chatMessage.setContent(chatMessage.getSender() + " joined the chat");
        return chatMessage;
    }
}
