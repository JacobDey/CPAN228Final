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
        List<Double> features = new ArrayList<>();

        //  Hand: encode up to 7 cards
        List<CardDTO> hand = isPlayer1 ? match.getPlayer1Hand() : match.getPlayer2Hand();

        for (int i = 0; i < 7; i++) {
            if (i < hand.size()) {
                CardDTO card = hand.get(i);
                features.add((double) card.getPower());

                // Add 3 ability flags
                boolean hasDestroy = false, hasDraw = false, hasBuff = false;

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
                            case GameConstants.EFFECT_POWER_CHANGE:
                                hasBuff = true;
                                break;
                        }
                    }
                }

                features.add(hasDestroy ? 1.0 : 0.0);
                features.add(hasDraw ? 1.0 : 0.0);
                features.add(hasBuff ? 1.0 : 0.0);
            } else {
                // Pad empty slots: 0 power, 0 abilities
                features.add(0.0); // power
                features.add(0.0); // destroy
                features.add(0.0); // draw
                features.add(0.0); // buff
            }
        }

        // Tower control (3 towers × 2 powers)
        for (Tower tower : match.getTowers()) {
            int p1Power = tower.getPlayer1Cards().stream().mapToInt(CardDTO::getPower).sum();
            int p2Power = tower.getPlayer2Cards().stream().mapToInt(CardDTO::getPower).sum();
            features.add((double) p1Power);
            features.add((double) p2Power);
        }

        //  Game phase info
        features.add((double) match.getTurn());
        features.add((double) match.getCardPlayedThisTurn());

        // Final shape check
        if (features.size() != 36) {
            throw new IllegalStateException("Expected 36 features, got " + features.size());
        }

        return Nd4j.create(features).reshape(1, 36);
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
