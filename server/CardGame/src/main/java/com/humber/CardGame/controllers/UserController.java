package com.humber.CardGame.controllers;

import com.humber.CardGame.models.MyUser;
import com.humber.CardGame.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

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
    public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password) {
        try {
            String token = userService.login(username, password);
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
    public ResponseEntity<Map<String,Integer>> getDeck(Principal principal) {
        try {
            String username = principal.getName(); //get username from jwt token
            Map<String,Integer> cards = userService.getUserDeck(username);
            return ResponseEntity.ok(cards);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(null);
        }
    }

    //add card to deck
    @PutMapping("/add/{cardId}")
    public ResponseEntity<String> AddCardToDeck(Principal principal, @PathVariable String cardId) {
        try {
            String username = principal.getName(); // get username from jwt token
            userService.addCardToDeck(username, cardId);
            return ResponseEntity.ok("Card added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    //remove card from deck
    @DeleteMapping("/remove/{cardId}")
    public ResponseEntity<String> RemoveCardFromDeck(Principal principal,@PathVariable String cardId) {
        try {
            String username = principal.getName();
            userService.removeCardFromDeck(username, cardId);
            return ResponseEntity.ok("Card removed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
