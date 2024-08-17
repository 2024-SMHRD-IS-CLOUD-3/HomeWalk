package com.example.homewalk.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.example.homewalk.entity.ChatMessage;

import java.util.HashMap;
import java.util.Map;

@Controller
public class ChatController {

    // 가족별 사용자 상태를 관리하는 맵
    private Map<String, Map<String, String>> familyUserStatusMap = new HashMap<>();

    @MessageMapping("/chat.sendMessage.{familyId}") // 클라이언트가 /app/chat.sendMessage로 보내는 메시지를 처리
    @SendTo("/topic/family/{familyId}") // 결과를 /topic/family/{familyId}로 전송하여 해당 주제를 구독한 모든 클라이언트에게 전송
    public ChatMessage sendMessage(@DestinationVariable String familyId, ChatMessage chatMessage) {
        if (chatMessage.getType() == ChatMessage.MessageType.LEAVE) {
            chatMessage.setContent(chatMessage.getSender() + " has left the chat");
            // 사용자가 나가면 상태를 LEAVE로 설정
            familyUserStatusMap.get(familyId).put(chatMessage.getSender(), "LEAVE");
        }
        chatMessage.setUserStatusMap(familyUserStatusMap.get(familyId)); // 현재 상태를 모든 클라이언트에게 전달
        return chatMessage;
    }

    @MessageMapping("/chat.addUser.{familyId}")
    @SendTo("/topic/family/{familyId}")
    public ChatMessage addUser(@DestinationVariable String familyId, ChatMessage chatMessage) {
        chatMessage.setContent(chatMessage.getSender() + " joined the chat");

        // 가족별로 사용자 상태 관리
        familyUserStatusMap.putIfAbsent(familyId, new HashMap<>());
        familyUserStatusMap.get(familyId).put(chatMessage.getSender(), "JOIN");

        // 현재 채팅방에 있는 모든 사용자 상태를 함께 전송
        chatMessage.setUserStatusMap(familyUserStatusMap.get(familyId));

        return chatMessage;
    }
}
