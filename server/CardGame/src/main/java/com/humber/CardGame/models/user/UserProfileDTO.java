package com.humber.CardGame.models.user;

import com.humber.CardGame.models.card.Deck;
import com.humber.CardGame.models.game.Match;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Map;


// model for data transfer user profile by removing sensitive data

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {
    private String id;
    private String username;
    private String email;
    private String role;
    private Date createdAt;
    private int credits;
    private Map<String, Integer> cards;
    private List<Deck> decks;
    private Deck selectedDeck;
    private List<Match> matchesHistory;
}
