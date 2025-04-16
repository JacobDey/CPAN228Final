package com.humber.CardGame.controllers.admin;

import com.humber.CardGame.models.card.Card;
import com.humber.CardGame.services.card.CardService;
import com.humber.CardGame.services.user.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@CrossOrigin
@RestController
@RequestMapping("/admin")
public class AdminController {

    private final CardService cardService;
    private final UserService userService;

    public AdminController(CardService cardService, UserService userService) {
        this.cardService = cardService;
        this.userService = userService;
    }

    @GetMapping("/test")
    public String test() {
        return "grant access to admin";
    }

    //add card to db
    @PostMapping("/addCard")
    public ResponseEntity<?> addCard( @Valid
            @RequestPart("card") Card card,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
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
    public ResponseEntity<String> editCard( @Valid
            @RequestPart("card") Card card,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
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

    @PutMapping("/addAllCard")
    public ResponseEntity<String> addAllCard(Principal principal) {
        String username = principal.getName();
        userService.addAllCards(username);
        return ResponseEntity.ok().build();
    }
}
