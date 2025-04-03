package com.humber.CardGame.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
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
    private String username;
    private String password;

    @Indexed(unique = true)
    private String email;
    private Date createdAt = new Date();
//    private Date lastLoginAt;
    private Map<String, Integer> cards = new HashMap<>(); // will change to default pack
    private Map<String, Deck> decks = new HashMap<>();
    private String selectedDeck;

    //match history
    private List<Match> matchesHistory = new ArrayList<>();

    public Deck getDeck(){
        return decks.get(selectedDeck);
    }
}
