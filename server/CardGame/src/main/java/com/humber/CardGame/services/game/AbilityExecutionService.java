package com.humber.CardGame.services.game;

import com.humber.CardGame.models.card.CardAbility;
import com.humber.CardGame.models.game.GameEvent;
import com.humber.CardGame.models.game.Match;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import com.humber.CardGame.constants.GameConstants; // Import constants
import com.humber.CardGame.models.card.CardDTO;

@Service
public class AbilityExecutionService {

    public Match executeAbility(GameEvent event, CardAbility ability) {
        Match match = event.getMatch();
        Map<String, Object> params = ability.getParams();

        // Assuming 'effect' is the key determining the action
        String effect = (String) params.get("effect");

        if (effect == null) {
            System.err.println("Ability effect is null for ability type: " + ability.getAbilityType());
            return match; // Or handle error appropriately
        }

        // Dispatch based on the effect type
        switch (effect.toUpperCase()) {
            case "POWER_CHANGE":
                applyPowerChange(match, event, params);
                break;
            case "DESTROY_CARD":
 
            // Add cases for "DRAW_CARD", "SWAP_CONTROL", etc.
            default:
                System.out.println("Unhandled ability effect: " + effect);
                break;
        }

        return match; // Return the potentially modified match state
    }

    // --- Helper Methods for Effect Categories ---

    private void applyPowerChange(Match match, GameEvent event, Map<String, Object> params) {
        String target = (String) params.get("target");
        Integer value = (Integer) params.get("value");
        // Extract other potential params like targetColor, powerThreshold, etc.

        if (target == null || value == null) {
            System.err.println("Missing parameters for POWER_CHANGE effect.");
            return;
        }

        System.out.println("Applying POWER_CHANGE: target=" + target + ", value=" + value);
        // TODO: Implement logic to:
        // 1. Identify the source of the ability (card, player, tower) from the 'event'.
        // 2. Parse the 'target' string (e.g., "YOUR_CARDS_HERE", "OPPOSING_BLUE_CARDS").
        // 3. Find the actual CardDTO objects in the 'match' state matching the target criteria.
        // 4. Modify the power of the found cards by 'value'.
    }

    private void applyDestruction(Match match, GameEvent event, Map<String, Object> params, String effectType) { // Renamed from destructionType for clarity
        String target = (String) params.get("target");
        String condition = (String) params.get("condition"); // Get the condition parameter

        if (target == null) {
             System.err.println("Missing target parameter for " + effectType + " effect.");
             return;
        }

        // --- Condition Check ---
        boolean conditionMet = checkCondition(match, event, params, condition);
        if (!conditionMet) {
            System.out.println("Condition '" + condition + "' not met for effect " + effectType + ". Skipping.");
            return; // Do not proceed with the effect if condition isn't met
        }
        // --- End Condition Check ---


        System.out.println("Applying " + effectType + ": target=" + target);

        // TODO: Implement logic based on 'target':
        // 1. Identify the source card/player of the ability (from event).
        CardDTO sourceCard = event.getSourceCard(); // Need source card from event
        String sourcePlayerName = event.getPlayer(); // Need source player ID from event

        // 2. Find the target CardDTO(s) based on 'target' param (SELF, CARD_BELOW, etc.)
        List<CardDTO> targetCards = findTargetCards(match, event, target, params); // You'll need a helper for this

        if (targetCards.isEmpty()) {
            System.out.println("No valid targets found for " + target);
            return;
        }

        // 3. Remove the card(s) from their location (hand, tower).
        for (CardDTO cardToDestroy : targetCards) {
            // ... logic to remove cardToDestroy from match state ...
            System.out.println("Destroying card: " + cardToDestroy.getName() + " (ID: " + cardToDestroy.getId() + ")");
            // IMPORTANT: Trigger ON_DEATH for the destroyed card (potentially create new GameEvent)
            // triggerOnDeathAbilities(match, cardToDestroy);
        }
    }

    // --- Helper method to check conditions ---
    private boolean checkCondition(Match match, GameEvent event, Map<String, Object> params, String condition) {
        if (condition == null) {
            return true; // No condition specified, always proceed
        }

        switch (condition.toUpperCase()) {
            case GameConstants.CONDITION_OWNERS_TURN:
                String sourcePlayerName = event.getPlayer(); // Requires source player ID in GameEvent
                String currentPlayerName = match.getCurrentTurnPlayer(); // Requires current player ID in Match
                if (sourcePlayerName == null || currentPlayerName == null) {
                     System.err.println("Cannot check OWNERS_TURN condition: Missing player IDs.");
                     return false; // Cannot verify, assume false
                }
                return sourcePlayerName.equals(currentPlayerName);

            // case GameConstants.CONDITION_TARGET_IS_COLOR:
            //     // Requires target card(s) and targetColor param
            //     // ... logic to check if the target card(s) match the color ...
            //     return /* result */;

            // case GameConstants.CONDITION_COLOR_PRESENT_HERE:
            //     // Requires source card location and targetColor param
            //     // ... logic to check if any card of targetColor exists at the source location ...
            //     return /* result */;

            default:
                System.err.println("Unhandled condition type: " + condition);
                return false; // Unknown condition, treat as not met
        }
    }

    // --- Placeholder for target finding logic ---
    private List<CardDTO> findTargetCards(Match match, GameEvent event, String target, Map<String, Object> params) {
        // TODO: Implement the complex logic to find cards based on target string
        // e.g., "SELF", "CARD_BELOW", "OPPOSING_UNCOVERED_BLUE", etc.
        // This will need access to match state (towers, players) and event source info.
        List<CardDTO> foundCards = new ArrayList<>();
         if (target.equalsIgnoreCase(GameConstants.TARGET_SELF)) {
             CardDTO sourceCard = event.getSourceCard();
             if (sourceCard != null) {
                 foundCards.add(sourceCard);
             }
         }
         // ... add many more cases for other target types ...
        return foundCards;
    }

    // Add more private helper methods for other effect categories...

}