package com.humber.CardGame.models.user;

import com.humber.CardGame.models.card.Deck;
import com.humber.CardGame.models.game.Match;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
public class MyUser {
    @Id
    private String id;
    private String role; // will have USER, ADMIN

    @Indexed(unique = true)
    @NotBlank(message = "Username is required")
    private String username;
    @NotBlank(message = "Password is required")
    @Size(min = 4, max = 16, message = "Password must be between 4 and 16 characters")
    private String password;

    @Indexed(unique = true)
    @Email(message = "Please enter valid email")
    @Pattern(regexp = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$",
            message = "Please provide a valid email address")
    @NotBlank(message = "Email is required")
    private String email;
    private Date createdAt = new Date();
    private int credit = 300;

    private Map<String, Integer> cards;
    @DBRef
    private List<Deck> decks;
    @DBRef
    private Deck selectedDeck;

    //match history
    @DBRef
    private List<Match> matchesHistory = new ArrayList<>();

}
