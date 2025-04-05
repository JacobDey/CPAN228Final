package com.humber.CardGame.controllers.card;

import com.humber.CardGame.models.card.Card;
import com.humber.CardGame.models.card.CardDTO;
import com.humber.CardGame.services.card.CardService;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

@CrossOrigin
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
    public ResponseEntity<List<CardDTO>> getCards() {
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
    public ResponseEntity<List<CardDTO>> getCardByName(@PathVariable String name) {
        List<CardDTO> cards = cardService.getCardByName(name);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/colour/{colour}")
    public ResponseEntity<List<CardDTO>> getCardByColour(@PathVariable String colour) {
        List<CardDTO> cards = cardService.getCardByColour(colour);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/power/{power}")
    public ResponseEntity<List<CardDTO>> getCardByPower(@PathVariable int power) {
        List<CardDTO> cards = cardService.getCardByPower(power);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/power/{minPower}/{maxPower}")
    public ResponseEntity<List<CardDTO>> getCardByPower(@PathVariable int minPower, @PathVariable int maxPower) {
        List<CardDTO> cards = cardService.getCardByPower(minPower, maxPower);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/power/min/{power}")
    public ResponseEntity<List<CardDTO>> getCardByMinPower(@PathVariable int power) {
        List<CardDTO> cards = cardService.getCardByMinPower(power);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/power/max/{power}")
    public ResponseEntity<List<CardDTO>> getCardByMaxPower(@PathVariable int power) {
        List<CardDTO> cards = cardService.getCardByMaxPower(power);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    //get image data
    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getCardImage(@PathVariable String id) {
        Card card = cardService.getCardById(id).orElseThrow();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(card.getImageType()))
                .cacheControl(CacheControl.maxAge(30, TimeUnit.DAYS)) // Cache for 30 days
                .body(card.getImageData());
    }

}
