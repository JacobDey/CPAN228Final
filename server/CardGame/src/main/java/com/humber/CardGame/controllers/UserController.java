package com.humber.CardGame.controllers;

import com.humber.CardGame.models.Deck;
import com.humber.CardGame.models.LoginRequest;
import com.humber.CardGame.models.MyUser;
import com.humber.CardGame.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    //register
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody MyUser user) {
        try {
            userService.saveUser(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }


    //login
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        try {
            String token = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    //get user card
    @GetMapping("/card")
    public ResponseEntity<Map<String,Integer>> getCard(Principal principal) {
        try {
            String username = principal.getName(); //get username from jwt token
            Map<String,Integer> cards = userService.getUserCards(username);
            return ResponseEntity.ok(cards);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(null);
        }
    }

    //get user deck
    @GetMapping("/deck")
    public ResponseEntity<Deck> getDeck(Principal principal) {
        try {
            String username = principal.getName(); //get username from jwt token
            Deck deck = userService.getUserDeck(username);
            return ResponseEntity.ok(deck);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(null);
        }
    }

    //add card to cards
    @PutMapping("/addCard/{cardId}")
    public ResponseEntity<String> addCard(Principal principal, @PathVariable String cardId) {
        try {
            String username = principal.getName(); // get username from jwt token
            userService.addCard(username, cardId);
            return ResponseEntity.ok("Card added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    //add card to deck
    @PutMapping("/addDeck/{deckId}/{cardId}")
    public ResponseEntity<String> AddCardToDeck(Principal principal, @PathVariable String cardId, @PathVariable String deckId) {
        try {
            String username = principal.getName(); // get username from jwt token
            userService.addCardToDeck(username, cardId, deckId);
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
            userService.removeCardFromDeck(username, cardId, deckId);
            return ResponseEntity.ok("Card removed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }


}


