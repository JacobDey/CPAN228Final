package com.humber.CardGame.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
    @CreatedDate
    private Date createdAt;

    private List<Tower> towers = new ArrayList<>();

    //user1
    private String player1;
    private int player1Score;
    private List<Card> player1Hand;
    private List<Card> player1Deck;
//    private List<Card> player1Field;

    //user2
    private String player2;
    private int player2Score;
    private List<Card> player2Hand;
    private List<Card> player2Deck;
//    private List<Card> player2Field;


}

