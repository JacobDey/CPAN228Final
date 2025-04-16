package com.humber.CardGame.controllers.user;

import com.humber.CardGame.models.card.CardDTO;
import com.humber.CardGame.models.card.Deck;
import com.humber.CardGame.models.user.LoginRequest;
import com.humber.CardGame.models.user.MyUser;
import com.humber.CardGame.models.user.UserProfileDTO;
import com.humber.CardGame.services.card.CardService;
import com.humber.CardGame.services.user.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final CardService cardService;

    public UserController(UserService userService, CardService cardService) {
        this.userService = userService;
        this.cardService = cardService;
    }

    //register
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody MyUser user) {
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
    public ResponseEntity<Deck> getDeck(Principal principal) {
        String username = principal.getName(); //get username from jwt token
        Deck deck = userService.getUserDeck(username);
        return ResponseEntity.ok(deck);
    }

    //get all user deck
    @GetMapping("/allDeck")
    public ResponseEntity<List<Deck>> getAllDeck(Principal principal) {
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

    //add cards to user cards
    @PutMapping("/addCards")
    public ResponseEntity<String> addCards(Principal principal, @RequestBody List<String> cardIds) {
        String username = principal.getName();
        userService.addCards(username,cardIds);
        return ResponseEntity.ok("Cards added successfully");
    }

    //get user profile
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(Principal principal) {
        String username = principal.getName();
        return ResponseEntity.ok(userService.getUserProfile(username));
    }

    //open booster pack
    @PutMapping("/booster")
    public ResponseEntity<List<CardDTO>> openBoosterPack(Principal principal) {
        String username = principal.getName();
        userService.reduceCredit(username, 300);
        return ResponseEntity.ok(cardService.getRandomCard(3));
    }

}


