package com.humber.CardGame.ai;


import com.humber.CardGame.constants.GameConstants;
import com.humber.CardGame.models.card.CardAbility;
import com.humber.CardGame.models.card.CardDTO;
import com.humber.CardGame.models.game.Match;
import com.humber.CardGame.models.game.Tower;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.factory.Nd4j;

import java.util.ArrayList;
import java.util.List;

public class GameStateConverter {

    // Convert Match object to feature vectors for the AI model
    public static INDArray convertMatchToFeatures(Match match, String aiPlayerName) {
        boolean isPlayer1 = match.getPlayer1().equals(aiPlayerName);
        List<Double> featureList = new ArrayList<>();

        // Hand: Power of up to 7 cards
        var playerHand = isPlayer1 ? match.getPlayer1Hand() : match.getPlayer2Hand();
        for (int i = 0; i < 7; i++) {
            if (i < playerHand.size()) {
                featureList.add((double) playerHand.get(i).getPower());
            } else {
                featureList.add(0.0);
            }
        }

        // Towers: 3 towers × 2 players = 6
        for (Tower tower : match.getTowers()) {
            int p1Power = tower.getPlayer1Cards().stream().mapToInt(CardDTO::getPower).sum();
            int p2Power = tower.getPlayer2Cards().stream().mapToInt(CardDTO::getPower).sum();
            featureList.add((double) p1Power);
            featureList.add((double) p2Power);
        }

        // Game state: turn and cards played
        featureList.add((double) match.getTurn());
        featureList.add((double) match.getCardPlayedThisTurn());

        // Ability flags
        boolean hasDestroy = false;
        boolean hasDraw = false;
        boolean hasOpponentDiscard = false;
        boolean hasSwapControl = false;
        boolean hasMovement = false;

        for (CardDTO card : playerHand) {
            if (card.getAbilities() != null) {
                for (CardAbility ab : card.getAbilities()) {
                    String effect = ((String) ab.getParams().get("effect")).toUpperCase();
                    switch (effect) {
                        case GameConstants.EFFECT_DESTROY_CARD:
                            hasDestroy = true;
                            break;
                        case GameConstants.EFFECT_DRAW_CARDS:
                            hasDraw = true;
                            break;
                        case GameConstants.EFFECT_OPPONENT_DISCARD:
                            hasOpponentDiscard = true;
                            break;
                        case GameConstants.EFFECT_SWAP_CONTROL:
                            hasSwapControl = true;
                            break;
                        case GameConstants.EFFECT_MOVE_DESTINATION:
                        case GameConstants.EFFECT_MOVE_DIRECTION:
                            hasMovement = true;
                            break;
                    }
                }
            }
        }

        // Add the 5 ability flags to the feature vector
        featureList.add(hasDestroy ? 1.0 : 0.0);
        featureList.add(hasDraw ? 1.0 : 0.0);
        featureList.add(hasOpponentDiscard ? 1.0 : 0.0);
        featureList.add(hasSwapControl ? 1.0 : 0.0);
        featureList.add(hasMovement ? 1.0 : 0.0);

        // Final check: feature size should be 20
        if (featureList.size() != 20) {
            throw new IllegalStateException("Expected 20 features, but got " + featureList.size());
        }

        return Nd4j.create(featureList).reshape(1, 20);
    }


//    private static int calculateFeatureSize(Match match) {
//        // Calculate total feature size based on game state
//        int size = 0;
//
//        // Add space for player hand (2 attributes per card × max hand size)
//        size += 2 * 7; // Assuming max hand size is 7
//
//        // Add space for towers (2 values per tower × 3 towers)
//        size += 2 * 3;
//
//        // Add space for game state info
//        size += 2; // turn + cards played
//
//        return size;
//    }
}
