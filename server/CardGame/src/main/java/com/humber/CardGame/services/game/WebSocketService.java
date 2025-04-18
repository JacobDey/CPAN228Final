package com.humber.CardGame.services.game;

import com.humber.CardGame.models.game.Match;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;


@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

//    Send match update
    public void sendMatchUpdate(Match match) {
        messagingTemplate.convertAndSend("/topic/match/"+ match.getId(), match);
    }

    // Send ability message and then clear them
    public void sendAbilityMessages(String matchId, String message) {
        System.out.println("WS: " + message);
        if (message == null || message.isEmpty()) {
            return;
        }
        // Send via WebSocket
        messagingTemplate.convertAndSend("/topic/match/" + matchId + "/messages", message);
    }
}
