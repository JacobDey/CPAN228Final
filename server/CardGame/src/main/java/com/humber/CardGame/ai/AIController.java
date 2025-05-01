package com.humber.CardGame.ai;

import com.humber.CardGame.models.game.GamePhase;
import com.humber.CardGame.models.game.Match;
import com.humber.CardGame.models.user.MyUser;
import com.humber.CardGame.repositories.UserRepository;
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
    private final UserRepository userRepository;

    public AIController(MatchService matchService, AIPlayerService aiPlayerService, UserRepository userRepository) {
        this.matchService = matchService;
        this.aiPlayerService = aiPlayerService;
        this.userRepository = userRepository;
    }

    @PutMapping("/{matchId}/aiMove")
    public ResponseEntity<?> makeAIMove(@PathVariable String matchId, @RequestParam(defaultValue = "medium") String difficulty) {

        Match match = matchService.getMatch(matchId);

        if(match == null) {
            return ResponseEntity.notFound().build();
        }

        String aiPlayerName = match.getPlayer2();
        if (!aiPlayerName.equals(match.getCurrentTurnPlayer())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("not AI Turn");
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
                return makeAIMove(matchId, difficulty);
            } else {
                // End turn after playing 3 cards
                matchService.endTurn(matchId, aiPlayerName);
            }
        }  else if (action.getType() == AIActionType.END_TURN) {
        matchService.endTurn(matchId, aiPlayerName);
        }

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{matchId}/TrainAI")
    public ResponseEntity<?> TrainAI(@PathVariable String matchId, @RequestParam(defaultValue = "medium") String difficulty, Principal principal) {

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
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            // Check if we should make another move or end turn
            match = matchService.getMatch(matchId);
            if (match.getCardPlayedThisTurn() < 3) {
                // Recursively make another move
                return TrainAI(matchId, difficulty, principal);
            } else {
                // End turn after playing 3 cards
                matchService.endTurn(matchId, aiPlayerName);
            }
        }  else if (action.getType() == AIActionType.END_TURN) {
            matchService.endTurn(matchId, aiPlayerName);
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{matchId}/RemoveAIMatch")
    public ResponseEntity<?> removeAIMatch(@PathVariable String matchId) {
        matchService.removeMatch(matchId);
        return ResponseEntity.ok().build();
    }

    private String getAIPlayerName(Match match) {
        // Logic to determine which player is AI
        // For this example, we'll assume player2 is always AI
        return match.getPlayer2();
    }

    @PostMapping("/playWithAI")
    public ResponseEntity<?> playWithAI(@RequestParam(defaultValue = "hard") String difficulty, Principal principal) {
        String username = principal.getName();
        Match match = matchService.createAIMatch(username);
        return ResponseEntity.ok(match);
    }
}
