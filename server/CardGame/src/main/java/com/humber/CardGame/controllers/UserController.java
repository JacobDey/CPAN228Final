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
        userService.saveUser(user);
        return ResponseEntity.ok("User registered successfully");
    }


    //login
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        String token = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity.ok(token);
    }

    //get user card
    @GetMapping("/card")
    public ResponseEntity<Map<String, Integer>> getCard(Principal principal) {
        String username = principal.getName(); //get username from jwt token
        Map<String, Integer> cards = userService.getUserCards(username);
        return ResponseEntity.ok(cards);
    }

    //set user deck
    @PutMapping("/selectDeck/{deckId}")
    public ResponseEntity<String> selectDeck(Principal principal, @PathVariable String deckId) {
        String username = principal.getName();
        userService.setSelectedDeck(username, deckId);
        return ResponseEntity.ok("Deck selected successfully");
    }


    //get user deck
    @GetMapping("/deck")
    public ResponseEntity<?> getDeck(Principal principal) {
        String username = principal.getName(); //get username from jwt token
        Deck deck = userService.getUserDeck(username);
        return ResponseEntity.ok(deck);
    }

    //get all user deck
    @GetMapping("/allDeck")
    public ResponseEntity<?> getAllDeck(Principal principal) {
        String username = principal.getName();
        return ResponseEntity.ok(userService.getUserDecks(username));
    }

    //add card to cards
    @PutMapping("/addCard/{cardId}")
    public ResponseEntity<String> addCard(Principal principal, @PathVariable String cardId) {
        String username = principal.getName(); // get username from jwt token
        userService.addCard(username, cardId);
        return ResponseEntity.ok("Card added successfully");
    }


}


