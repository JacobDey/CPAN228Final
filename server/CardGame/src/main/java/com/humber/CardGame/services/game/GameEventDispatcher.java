package com.humber.CardGame.services.game;

import com.humber.CardGame.constants.GameConstants;
import com.humber.CardGame.models.card.CardAbility;
import com.humber.CardGame.models.card.CardDTO;
import com.humber.CardGame.models.game.GameEvent;
import com.humber.CardGame.models.game.Match;
import com.humber.CardGame.models.game.Tower;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GameEventDispatcher {
    @Autowired
    private AbilityExecutionService abilityExecutionService;

    /**
     * Dispatches a game event, triggers relevant abilities, and returns the updated
     * match state.
     * 
     * @param event The game event to process
     * @return The updated Match object
     */
    public Match dispatchEvent(GameEvent event) {
        Match match = event.getMatch();
        List<CardAbility> abilitiesToExecute = new ArrayList<>();
        List<GameEvent> eventsForExecution = new ArrayList<>(); // Store events corresponding to abilities

        // --- Handle TURN_START Event ---
        if (GameConstants.EVENT_TURN_START.equals(event.getEventType())) {
            int towerIndex = 0;
            for (Tower tower : match.getTowers()) {
                towerIndex++; // Track current tower index (1-based)
                // Check Player 1's cards
                for (CardDTO card : new ArrayList<>(tower.getPlayer1Cards())) { // Iterate over a copy
                    if (card.getAbilities() != null) {
                        for (CardAbility ability : card.getAbilities()) {
                            if (GameConstants.TRIGGER_TURN_START.equals(ability.getAbilityType())) {
                                // Create a specific event for this card's ability trigger
                                GameEvent abilityEvent = new GameEvent(event.getEventType(), card, towerIndex, event.getPlayer(), match, null);
                                abilitiesToExecute.add(ability);
                                eventsForExecution.add(abilityEvent);
                            }
                        }
                    }
                }
                // Check Player 2's cards
                for (CardDTO card : new ArrayList<>(tower.getPlayer2Cards())) { // Iterate over a copy
                    if (card.getAbilities() != null) {
                        for (CardAbility ability : card.getAbilities()) {
                            if (GameConstants.TRIGGER_TURN_START.equals(ability.getAbilityType())) {
                                // Create a specific event for this card's ability trigger
                                GameEvent abilityEvent = new GameEvent(event.getEventType(), card, towerIndex, event.getPlayer(), match, null);
                                abilitiesToExecute.add(ability);
                                eventsForExecution.add(abilityEvent);
                            }
                        }
                    }
                }
            }
        }
        // --- Handle CARD_PLAYED Event (ON_ENTER abilities) ---
        else if (GameConstants.EVENT_CARD_PLAYED.equals(event.getEventType())) {
            CardDTO sourceCard = event.getSourceCard();
            if (sourceCard != null && sourceCard.getAbilities() != null) {
                for (CardAbility ability : sourceCard.getAbilities()) {
                    if (GameConstants.TRIGGER_ON_ENTER.equals(ability.getAbilityType())) {
                        abilitiesToExecute.add(ability);
                        eventsForExecution.add(event); // Use the original event
                    }
                }
            }
        }
        // --- Handle CARD_DESTROYED Event (ON_CARD_DESTROYED abilities) ---
        // (Add similar logic here if you implement ON_CARD_DESTROYED triggers globally)

        // --- Execute collected abilities ---
        // Use the corresponding event for each ability execution
        for (int i = 0; i < abilitiesToExecute.size(); i++) {
            CardAbility ability = abilitiesToExecute.get(i);
            GameEvent executionEvent = eventsForExecution.get(i);
            // IMPORTANT: Update the match state in the event before executing the next
            // ability
            executionEvent.setMatch(match);
            match = abilityExecutionService.executeAbility(executionEvent, ability);
        }

        return match; // Return the final state of the match
    }
}