package com.example.homewalk.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.example.homewalk.entity.ChatMessage;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage") // 클라이언트가 /app/chat.sendMessage로 보내는 메시지를 처리
    @SendTo("/topic/public") // 결과를 /topic/public으로 전송하여 해당 주제를 구독한 모든 클라이언트에게 전송
    public ChatMessage sendMessage(ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(ChatMessage chatMessage) {
        chatMessage.setContent(chatMessage.getSender() + " joined the chat");
        return chatMessage;
    }
}
