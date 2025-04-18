package com.humber.CardGame.controllers.game;

import com.humber.CardGame.models.game.Match;
import com.humber.CardGame.services.game.MatchService;
import com.humber.CardGame.services.game.WebSocketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/matches")
@CrossOrigin
public class MatchController {

    final MatchService matchService;
    private final WebSocketService webSocketService;

    public MatchController(MatchService matchService, WebSocketService webSocketService) {
        this.matchService = matchService;
        this.webSocketService = webSocketService;
    }

    @GetMapping
    public ResponseEntity<List<Match>> getAllMatches() {
        List<Match> matches = matchService.getAllMatches();
        return ResponseEntity.ok(matches);
    }

    //get waiting match
    @GetMapping("/ongoing")
    public ResponseEntity<List<Match>> getOngoingMatches() {
        List<Match> matches = matchService.getOngoingMatches();
        return ResponseEntity.ok(matches);
    }

    //create new match
    @PostMapping("/create")
    public ResponseEntity<Match> createMatch(Principal principal) {
        String username = principal.getName();
        Match match = matchService.createMatch(username);
        return ResponseEntity.ok(match);
    }

    //join new match
    @PostMapping("/{matchId}/join")
    public ResponseEntity<Match> joinMatch(Principal principal, @PathVariable String matchId) {
        String username = principal.getName();
        Match match = matchService.joinMatch(matchId, username);
        return ResponseEntity.ok(match);
    }

    //join ongoing match
    @PostMapping("/{matchId}/joinOngoing")
    public ResponseEntity<Match> joinOngoingMatch(Principal principal, @PathVariable String matchId) {
        String username = principal.getName();
        Match match = matchService.joinOngoingMatch(matchId, username);
        return ResponseEntity.ok(match);
    }

    //start player turn
    @PutMapping("/{matchId}/startTurn")
    public ResponseEntity<Match> startTurn(Principal principal, @PathVariable String matchId) {
        String username = principal.getName();
        Match match = matchService.startTurn(matchId, username);
        return ResponseEntity.ok(match);
    }

    //play card on tower
    @PutMapping("/{matchId}/play")
    public ResponseEntity<Match> playMatch(Principal principal, @PathVariable String matchId, @RequestParam String cardId, @RequestParam int towerId) {
        String username = principal.getName();
        Match match = matchService.playCard(matchId, username, cardId, towerId);
        return ResponseEntity.ok(match);
    }

    //end turn
    @PutMapping("/{matchId}/end")
    public ResponseEntity<Match> endTurn(Principal principal, @PathVariable String matchId) {
        String username = principal.getName();
        Match match = matchService.endTurn(matchId, username);
        return ResponseEntity.ok(match);
    }

    //get match object
    @GetMapping("/{matchId}")
    public ResponseEntity<Match> getMatch(@PathVariable String matchId) {
        Match match = matchService.getMatch(matchId);
        return ResponseEntity.ok(match);
    }

}
