package com.humber.CardGame.controllers.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.humber.CardGame.models.card.Card;
import com.humber.CardGame.services.card.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private CardService cardService;
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/test")
    public String test() {
        return "grant access to admin";
    }

    //add card to db
    @PostMapping("/addCard")
    public ResponseEntity<?> addCard(
            @RequestPart("card") String cardJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            Card card = objectMapper.readValue(cardJson, Card.class);
            System.out.println(imageFile.getBytes());
            if (imageFile != null && !imageFile.isEmpty()) {
                card.setImageData(imageFile.getBytes());
                card.setImageType(imageFile.getContentType());
            }
            cardService.saveCardToDatabase(card);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing card: " + e.getMessage());
        }
    }

    //edit card
    @PutMapping("/editCard")
    public ResponseEntity<String> editCard(
            @RequestPart("card") String cardJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            Card card = objectMapper.readValue(cardJson, Card.class);
            System.out.println(imageFile.getBytes());
            if (imageFile != null && !imageFile.isEmpty()) {
                card.setImageData(imageFile.getBytes());
                card.setImageType(imageFile.getContentType());
            }
            cardService.editCardData(card);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing card: " + e.getMessage());
        }
    }

    //remove card from db
    @DeleteMapping("/deleteCard/{cardId}")
    public ResponseEntity<String> deleteCard(@PathVariable String cardId) {
        cardService.deleteCardFromDatabase(cardId);
        return ResponseEntity.ok("success, card deleted from database");
    }
}
