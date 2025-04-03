package com.humber.CardGame.models;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Tower {
    private int id;
    private int victoryPoints;
    private List<Card> player1Cards;
    private List<Card> player2Cards;

    public int getControllingPlayerId() {
        int p1Power = 0;
        for (Card card : player1Cards) {
            p1Power += card.getPower();
        }
        int p2Power = 0;
        for (Card card : player2Cards) {
            p2Power += card.getPower();
        }

        if (p1Power > p2Power) return 1;
        if (p2Power > p1Power) return 2;
        return 0;
    }
}