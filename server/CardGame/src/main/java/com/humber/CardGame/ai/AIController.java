package com.humber.CardGame.ai;

import com.humber.CardGame.models.game.GamePhase;
import com.humber.CardGame.models.game.Match;
import com.humber.CardGame.services.game.MatchService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/ai")
public class AIController {

    private final MatchService matchService;
    private final AIPlayerService aiPlayerService;

    public AIController(MatchService matchService, AIPlayerService aiPlayerService) {
        this.matchService = matchService;
        this.aiPlayerService = aiPlayerService;
    }

    @PutMapping("/{matchId}/aiMove")
    public ResponseEntity<?> makeAIMove(@PathVariable String matchId, @RequestParam(defaultValue = "medium") String difficulty, Principal principal) {

        Match match = matchService.getMatch(matchId);

        if(match == null) {
            return ResponseEntity.notFound().build();
        }

        String aiPlayerName = principal.getName();
        if (!aiPlayerName.equals(match.getCurrentTurnPlayer())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("It's not your turn.");
        }

        //if its beginning phase, start the turn
        if(match.getCurrentPhase().equals(GamePhase.BEGIN)) {
            matchService.startTurn(matchId, aiPlayerName);
            match = matchService.getMatch(matchId); // refresh match data
        }

        //get AI decision
        AIAction action = aiPlayerService.decideMove(match, aiPlayerName, difficulty);

        //execute AI action
        if(action.getType() == AIActionType.PLAY_CARD) {
            matchService.playCard(matchId, aiPlayerName, action.getCardId(), action.getTowerId());
            // Small delay to make AI moves feel natural
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            // Check if we should make another move or end turn
            match = matchService.getMatch(matchId);
            if (match.getCardPlayedThisTurn() < 3) {
                // Recursively make another move
                return makeAIMove(matchId, difficulty, principal);
            } else {
                // End turn after playing 3 cards
                matchService.endTurn(matchId, aiPlayerName);
            }
        }  else if (action.getType() == AIActionType.END_TURN) {
        matchService.endTurn(matchId, aiPlayerName);
        }

        return ResponseEntity.ok().build();
    }

    private String getAIPlayerName(Match match) {
        // Logic to determine which player is AI
        // For this example, we'll assume player2 is always AI
        return match.getPlayer2();
    }
}
