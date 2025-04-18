package com.humber.CardGame.models.game;

import com.humber.CardGame.models.card.CardDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "matches")
public class Match {
    @Id
    private String id;
    private int turn;
    private String currentTurnPlayer;
    private MatchStatus status;
    private GamePhase currentPhase;
    private int cardPlayedThisTurn;

    private Date createdAt = new Date();

    private List<Tower> towers = new ArrayList<>();

    //user1
    private String player1;
    private int player1Score;
    private List<CardDTO> player1Hand;
    private List<CardDTO> player1Deck;

    //user2
    private String player2;
    private int player2Score;
    private List<CardDTO> player2Hand;
    private List<CardDTO> player2Deck;

}

