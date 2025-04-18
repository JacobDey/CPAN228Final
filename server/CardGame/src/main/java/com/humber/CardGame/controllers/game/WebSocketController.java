package com.humber.CardGame.controllers.game;

import com.humber.CardGame.models.game.Match;
import com.humber.CardGame.services.game.MatchService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class WebSocketController {

    private final MatchService matchService;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(MatchService matchService, SimpMessagingTemplate messagingTemplate) {
        this.matchService = matchService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/match/{matchId}/fetch")
    public void fetchMatch(@DestinationVariable String matchId, Principal principal) {
        // Fetch the latest match data and send it back to the requesting client
        Match match = matchService.getMatch(matchId);
        messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/match/" + matchId, match);
    }
}
