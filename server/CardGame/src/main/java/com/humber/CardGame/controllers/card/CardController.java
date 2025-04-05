package com.humber.CardGame.controllers.card;

import com.humber.CardGame.models.card.Card;
import com.humber.CardGame.models.card.CardDTO;
import com.humber.CardGame.services.card.CardService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    //get all cards with paginated and sort
    @GetMapping("/cards")
    public ResponseEntity<Page<CardDTO>> getCards(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "6") int size,
                                                  @RequestParam(defaultValue = "colour") String sortField,
                                                  @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(cardService.getAllCard(pageable));
    }

    //get all card without paginated
    @GetMapping("/allCards")
    public ResponseEntity<List<CardDTO>> getAllCards() {
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

    //get random card
    @GetMapping("/random/{count}")
    public ResponseEntity<List<CardDTO>> getRandomCards(@PathVariable int count) {
        return ResponseEntity.ok(cardService.getRandomCard(count));
    }

    //get filtered card
    @GetMapping("/name/{name}")
    public ResponseEntity<Page<CardDTO>> getCardByName(@PathVariable String name,
                                                       @RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "6") int size,
                                                       @RequestParam(defaultValue = "colour") String sortField,
                                                       @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CardDTO> cards = cardService.getCardByName(name, pageable);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/colour/{colour}")
    public ResponseEntity<Page<CardDTO>> getCardByColour(@PathVariable String colour,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "6") int size,
                                                         @RequestParam(defaultValue = "colour") String sortField,
                                                         @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CardDTO> cards = cardService.getCardByColour(colour, pageable);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/power/{power}")
    public ResponseEntity<Page<CardDTO>> getCardByPower(@PathVariable int power,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "6") int size,
                                                        @RequestParam(defaultValue = "power") String sortField,
                                                        @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CardDTO> cards = cardService.getCardByPower(power, pageable);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/power/{minPower}/{maxPower}")
    public ResponseEntity<Page<CardDTO>> getCardByPower(@PathVariable int minPower, @PathVariable int maxPower,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "6") int size,
                                                        @RequestParam(defaultValue = "power") String sortField,
                                                        @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size,sort);
        Page<CardDTO> cards = cardService.getCardByPower(minPower, maxPower, pageable);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/power/min/{power}")
    public ResponseEntity<Page<CardDTO>> getCardByMinPower(@PathVariable int power,
                                                           @RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "6") int size,
                                                           @RequestParam(defaultValue = "power") String sortField,
                                                           @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size,sort);
        Page<CardDTO> cards = cardService.getCardByMinPower(power, pageable);
        if (cards.isEmpty()) {
            throw new IllegalStateException("No card meets the criteria");
        }
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/power/max/{power}")
    public ResponseEntity<Page<CardDTO>> getCardByMaxPower(@PathVariable int power,
                                                           @RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "6") int size,
                                                           @RequestParam(defaultValue = "power") String sortField,
                                                           @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CardDTO> cards = cardService.getCardByMaxPower(power, pageable);
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
