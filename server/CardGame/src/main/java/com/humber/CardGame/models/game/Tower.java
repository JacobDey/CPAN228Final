package com.humber.CardGame.models.game;

import com.humber.CardGame.models.card.Card;
import com.humber.CardGame.models.card.CardDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Tower {
    private int id;
    private int victoryPoints;
    private List<CardDTO> player1Cards;
    private List<CardDTO> player2Cards;

    public int getControllingPlayerId() {
        int p1Power = 0;
        for (CardDTO card : player1Cards) {
            p1Power += card.getPower();
        }
        int p2Power = 0;
        for (CardDTO card : player2Cards) {
            p2Power += card.getPower();
        }

        if (p1Power > p2Power) return 1;
        if (p2Power > p1Power) return 2;
        return 0;
    }
}