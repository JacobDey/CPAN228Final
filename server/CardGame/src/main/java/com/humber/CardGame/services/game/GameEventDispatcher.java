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
import java.util.LinkedList; // Import LinkedList for Queue
import java.util.List;
import java.util.Map;
import java.util.Queue; // Import Queue

@Service
public class GameEventDispatcher {

    private final AbilityExecutionService abilityExecutionService;

    // Use constructor injection
    @Autowired
    public GameEventDispatcher(AbilityExecutionService abilityExecutionService) {
        this.abilityExecutionService = abilityExecutionService;
    }

    /**
     * Dispatches a game event, triggers relevant abilities, processes consequences,
     * and returns the final updated match state.
     *
     * @param initialEvent The initial game event to process
     * @return The final updated Match object after all events and abilities resolve
     */
    public Match dispatchEvent(GameEvent initialEvent) {
        // Ensure the initial event has a valid match object
        if (initialEvent == null || initialEvent.getMatch() == null) {
            throw new IllegalArgumentException("Initial event or its match cannot be null.");
        }

        Match match = initialEvent.getMatch();
        Queue<GameEvent> eventQueue = new LinkedList<>();
        eventQueue.offer(initialEvent); // Add the first event to the queue

        while (!eventQueue.isEmpty()) {
            GameEvent currentEvent = eventQueue.poll(); // Get the next event to process

            // Update the event's match reference to the latest state BEFORE finding abilities
            currentEvent.setMatch(match);

            List<CardAbility> abilitiesToExecute = new ArrayList<>();
            List<GameEvent> eventsForExecution = new ArrayList<>(); // Context for each ability execution

            // --- Identify Abilities Triggered by currentEvent ---

            String eventType = currentEvent.getEventType();

            // --- Handle TURN_START Event ---
            if (GameConstants.EVENT_TURN_START.equals(eventType)) {
                int towerIndex = 0;
                for (Tower tower : match.getTowers()) {
                    towerIndex++; // Track current tower index (1-based)
                    String player1 = match.getPlayer1();
                    String player2 = match.getPlayer2();

                    // Check Player 1's cards
                    for (CardDTO card : new ArrayList<>(tower.getPlayer1Cards())) { // Iterate over a copy
                        if (card.getAbilities() != null) {
                            for (CardAbility ability : card.getAbilities()) {
                                if (GameConstants.TRIGGER_TURN_START.equals(ability.getAbilityType())) {
                                    // Create specific event context for this card's trigger
                                    GameEvent abilityEvent = new GameEvent(
                                        eventType, card, towerIndex, player1, match, null
                                    );
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
                                    // Create specific event context for this card's trigger
                                    GameEvent abilityEvent = new GameEvent(
                                        eventType, card, towerIndex, player2, match, null
                                    );
                                    abilitiesToExecute.add(ability);
                                    eventsForExecution.add(abilityEvent);
                                }
                            }
                        }
                    }
                }
            }
            // --- Handle CARD_PLAYED Event (ON_ENTER abilities) ---
            else if (GameConstants.EVENT_CARD_PLAYED.equals(eventType)) {
                CardDTO sourceCard = currentEvent.getSourceCard();
                if (sourceCard != null && sourceCard.getAbilities() != null) {
                    for (CardAbility ability : sourceCard.getAbilities()) {
                        if (GameConstants.TRIGGER_ON_ENTER.equals(ability.getAbilityType())) {
                            abilitiesToExecute.add(ability);
                            // Use the original CARD_PLAYED event as context
                            eventsForExecution.add(currentEvent);
                        }
                    }
                }
            }
                        // ... inside dispatchEvent method, inside while loop ...

            // --- Handle CARD_DESTROYED Event (ON_DEATH and ON_CARD_DESTROYED abilities) ---
            else if (GameConstants.EVENT_CARD_DESTROYED.equals(eventType)) {
                CardDTO destroyedCard = currentEvent.getSourceCard(); // The card that was destroyed
                String destroyedCardUid = (destroyedCard != null) ? destroyedCard.getUid() : null;

                // 1. Check the destroyed card for ON_DEATH triggers
                if (destroyedCard != null && destroyedCard.getAbilities() != null) {
                    for (CardAbility ability : destroyedCard.getAbilities()) {
                        if (GameConstants.TRIGGER_ON_DEATH.equals(ability.getAbilityType())) {
                            // The CARD_DESTROYED event itself has the correct context
                            abilitiesToExecute.add(ability);
                            eventsForExecution.add(currentEvent);
                        }
                    }
                }

                // 2. Check ALL OTHER cards for ON_CARD_DESTROYED triggers
                int towerIndex = 0;
                for (Tower tower : match.getTowers()) {
                    towerIndex++; // Track current tower index (1-based)
                    String player1 = match.getPlayer1();
                    String player2 = match.getPlayer2();

                    // Check Player 1's cards
                    for (CardDTO card : new ArrayList<>(tower.getPlayer1Cards())) { // Iterate over a copy
                        // Skip the card that was just destroyed
                        if (destroyedCardUid != null && card.getUid().equals(destroyedCardUid)) {
                            continue;
                        }
                        if (card.getAbilities() != null) {
                            for (CardAbility ability : card.getAbilities()) {
                                if (GameConstants.TRIGGER_ON_CARD_DESTROYED.equals(ability.getAbilityType())) {
                                    // Create specific event context for *this* card's trigger
                                    GameEvent abilityEvent = new GameEvent(
                                        eventType, // Still triggered by CARD_DESTROYED
                                        card,      // Source is the card with the ability
                                        towerIndex,// Where the source card is
                                        player1,   // Owner of the source card
                                        match,     // Current match state
                                        // Optionally pass destroyedCard as context if needed by ability logic
                                        Map.of("destroyedCard", destroyedCard)
                                    );
                                    abilitiesToExecute.add(ability);
                                    eventsForExecution.add(abilityEvent);
                                }
                            }
                        }
                    }
                    // Check Player 2's cards
                    for (CardDTO card : new ArrayList<>(tower.getPlayer2Cards())) { // Iterate over a copy
                        // Skip the card that was just destroyed
                         if (destroyedCardUid != null && card.getUid().equals(destroyedCardUid)) {
                            continue;
                        }
                         if (card.getAbilities() != null) {
                            for (CardAbility ability : card.getAbilities()) {
                                if (GameConstants.TRIGGER_ON_CARD_DESTROYED.equals(ability.getAbilityType())) {
                                     // Create specific event context for *this* card's trigger
                                    GameEvent abilityEvent = new GameEvent(
                                        eventType, // Still triggered by CARD_DESTROYED
                                        card,      // Source is the card with the ability
                                        towerIndex,// Where the source card is
                                        player2,   // Owner of the source card
                                        match,     // Current match state
                                        // Optionally pass destroyedCard as context if needed by ability logic
                                        Map.of("destroyedCard", destroyedCard)
                                    );
                                    abilitiesToExecute.add(ability);
                                    eventsForExecution.add(abilityEvent);
                                }
                            }
                        }
                    }
                } // End loop through towers
            }
            // --- Add other event type handlers here (e.g., EVENT_TURN_END) ---

            // ... rest of the dispatchEvent method (execution loop) remains the same ...
            // --- Add other event type handlers here (e.g., EVENT_TURN_END) ---


            // --- Execute collected abilities for the currentEvent ---
            for (int i = 0; i < abilitiesToExecute.size(); i++) {
                CardAbility ability = abilitiesToExecute.get(i);
                GameEvent executionEvent = eventsForExecution.get(i);

                // Ensure the execution event has the most up-to-date match state BEFORE execution
                executionEvent.setMatch(match);

                // Execute the ability and get the result
                AbilityResult result = abilityExecutionService.executeAbility(executionEvent, ability);

                // IMPORTANT: Update the central match state immediately after execution
                match = result.updatedMatch;

                // Add any newly generated events (like subsequent deaths) to the main queue
                // These will be processed in subsequent iterations of the while loop
                for (GameEvent generatedEvent : result.generatedEvents) {
                    // Ensure generated events also have the latest match state reference
                    generatedEvent.setMatch(match);
                    eventQueue.offer(generatedEvent);
                }

                // Update the match reference in the remaining eventsForExecution *for this batch*
                // This ensures subsequent abilities in this *specific* batch see the changes
                // made by the ability that just executed.
                for (int j = i + 1; j < eventsForExecution.size(); j++) {
                    eventsForExecution.get(j).setMatch(match);
                }
            }
        } // End while loop (queue processing)

        // Return the final state of the match after all events and abilities have resolved
        return match;
    }
}