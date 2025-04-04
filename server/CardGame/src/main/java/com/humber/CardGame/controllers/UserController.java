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

    @PutMapping("/newDeck/{deckName}")
    public ResponseEntity<String> createDeck(Principal principal, @PathVariable String deckName) {
        try {
            String username = principal.getName();
            userService.createNewDeck(username, deckName);
            return ResponseEntity.ok("Deck \"" + deckName + "\" created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PutMapping("/selectDeck/{deckId}")
    public ResponseEntity<String> selectDeck(Principal principal, @PathVariable String deckId) {
        try {
            String username = principal.getName();
            userService.setSelectedDeck(username, deckId);
            return ResponseEntity.ok("Deck selected successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @DeleteMapping("/deleteDeck/{deckId}")
    public ResponseEntity<String> deleteDeck(Principal principal, @PathVariable String deckId){
        try{
            String username = principal.getName();
            userService.deleteDeck(username, deckId);
            return ResponseEntity.ok("Deck deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
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




}


