package com.example.homewalk.entity;

import java.util.Map;

import lombok.Data;

@Data
public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
    
    private Map<String, String> userStatusMap; // 사용자 상태 맵 추가
}	


