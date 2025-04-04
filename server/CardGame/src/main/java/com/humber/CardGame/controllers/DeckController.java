package com.humber.CardGame.controllers;

import com.humber.CardGame.models.Deck;
import com.humber.CardGame.services.DeckService;
import com.humber.CardGame.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/decks")
public class DeckController {
    @Autowired private DeckService deckService;
    @Autowired private UserService userService;

    @PostMapping("/newDeck")
    public Deck createDeck(Principal principal, @RequestParam(required = false) String deckName) {
        String username = principal.getName();
        if(deckName == null) deckName = "default";
        return userService.createNewDeck(username, deckName);
    }

    //add card to deck
    @PutMapping("/addDeck/{deckId}/{cardId}")
    public ResponseEntity<String> AddCardToDeck(Principal principal, @PathVariable String cardId, @PathVariable String deckId) {
        try {
            String username = principal.getName(); // get username from jwt token
            deckService.addCardToDeck(username, cardId, deckId);
            return ResponseEntity.ok("Card added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    //remove card from deck
    @DeleteMapping("/removeDeck/{deckId}/{cardId}")
    public ResponseEntity<String> RemoveCardFromDeck(Principal principal,@PathVariable String cardId, @PathVariable String deckId) {
        try {
            String username = principal.getName();
            deckService.removeCardFromDeck(username, cardId, deckId);
            return ResponseEntity.ok("Card removed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
