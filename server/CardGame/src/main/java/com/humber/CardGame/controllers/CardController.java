package com.humber.CardGame.controllers;

import com.humber.CardGame.models.Card;
import com.humber.CardGame.services.CardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/card")
public class CardController {

    //injecting service
    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    //get all cards
    @GetMapping("/cards")
    public ResponseEntity<List<Card>> getCards() {
        return ResponseEntity.ok(cardService.getAllCard());
    }

    //get card by id
    @GetMapping("/id/{id}")
    public ResponseEntity<Card> getCardById(@PathVariable String id) {
        Card card = cardService.getCardById(id).orElse(null);
        if (card == null) {
            throw new IllegalStateException("Card not found");
        }
        return ResponseEntity.ok(card);
    }

    //get filtered card
    @GetMapping("/name/{name}")
    public ResponseEntity<List<Card>> getCardByName(@PathVariable String name) {
        List<Card> cards = cardService.getCardByName(name);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/colour/{colour}")
    public ResponseEntity<List<Card>> getCardByColour(@PathVariable String colour) {
        List<Card> cards = cardService.getCardByColour(colour);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/power/{power}")
    public ResponseEntity<List<Card>> getCardByPower(@PathVariable int power) {
        List<Card> cards = cardService.getCardByPower(power);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/power/{minPower}/{maxPower}")
    public ResponseEntity<List<Card>> getCardByPower(@PathVariable int minPower, @PathVariable int maxPower) {
        List<Card> cards = cardService.getCardByPower(minPower, maxPower);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/power/min/{power}")
    public ResponseEntity<List<Card>> getCardByMinPower(@PathVariable int power) {
        List<Card> cards = cardService.getCardByMinPower(power);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/power/max/{power}")
    public ResponseEntity<List<Card>> getCardByMaxPower(@PathVariable int power) {
        List<Card> cards = cardService.getCardByMaxPower(power);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }



}
