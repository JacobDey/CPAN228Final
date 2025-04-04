package com.humber.CardGame.controllers.admin;

import com.humber.CardGame.models.card.Card;
import com.humber.CardGame.services.card.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private CardService cardService;

    @GetMapping("/test")
    public String test() {
        return "grant access to admin";
    }

    //add card to db
    @PostMapping("/addCard")
    public ResponseEntity<String> addCard(@RequestBody Card card) {
        cardService.saveCardToDatabase(card);
        return ResponseEntity.ok("success, card added to database");
    }

    //edit card
    @PutMapping("/editCard")
    public ResponseEntity<String> editCard(@RequestBody Card card) {
        cardService.editCardData(card);
        return ResponseEntity.ok("success, card edited");
    }

    //remove card from db
    @DeleteMapping("/deleteCard/{cardId}")
    public ResponseEntity<String> deleteCard(@PathVariable String cardId) {
        cardService.deleteCardFromDatabase(cardId);
        return ResponseEntity.ok("success, card deleted from database");
    }
}
