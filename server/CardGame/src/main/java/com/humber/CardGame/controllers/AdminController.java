package com.humber.CardGame.controllers;

import com.humber.CardGame.models.Card;
import com.humber.CardGame.services.CardService;
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
        try {
            cardService.saveCardToDatabase(card);
            return ResponseEntity.ok("success, card added to database");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    //edit card
    @PutMapping("/editCard")
    public ResponseEntity<String> editCard(@RequestBody Card card) {
        try {
            cardService.editCardData(card);
            return ResponseEntity.ok("success, card edited");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    //remove card from db
    @DeleteMapping("/deleteCard/{cardId}")
    public ResponseEntity<String> deleteCard(@PathVariable String cardId) {
        try {
            cardService.deleteCardFromDatabase(cardId);
            return ResponseEntity.ok("success, card deleted from database");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
