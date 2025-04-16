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
import com.humber.CardGame.models.game.Tower;
import java.util.Random;
import java.util.Collections;

@Service
public class AbilityExecutionService {

    public AbilityResult executeAbility(GameEvent event, CardAbility ability) {
        Match match = event.getMatch();
        Map<String, Object> params = ability.getParams();
        String effect = (String) params.get("effect");
        List<GameEvent> generatedEvents = new ArrayList<>(); // Initialize list
        if (effect == null) {
            System.err.println("Ability effect is null for ability type: " + ability.getAbilityType());
            return new AbilityResult(match, generatedEvents); // Return result
        }
        String cardName = event.getSourceCard() != null ? event.getSourceCard().getName() : "A card";
        switch (effect.toUpperCase()) {
            case GameConstants.EFFECT_POWER_CHANGE:
                applyPowerChange(match, event, params);
                // Print what just happened
                List<CardDTO> powerTargets = findTargetCards(match, event, (String) params.get("target"), params);
                Integer value = (Integer) params.get("value");
                if (powerTargets.size() == 1) {
                    System.out.println(cardName + " just changed " + powerTargets.get(0).getName() + "'s power by " + value + ".");
                } else if (!powerTargets.isEmpty()) {
                    String names = powerTargets.stream().map(CardDTO::getName).reduce((a, b) -> a + ", " + b).orElse("");
                    System.out.println(cardName + " just changed " + names + "'s power by " + value + ".");
                }
                break;
            case GameConstants.EFFECT_DESTROY_CARD:
                List<CardDTO> destroyTargets = findTargetCards(match, event, (String) params.get("target"), params);
                generatedEvents.addAll(applyDestruction(match, event, params));
                if (destroyTargets.size() == 1) {
                    System.out.println(cardName + " destroyed " + destroyTargets.get(0).getName() + "!");
                } else if (!destroyTargets.isEmpty()) {
                    String names = destroyTargets.stream().map(CardDTO::getName).reduce((a, b) -> a + ", " + b).orElse("");
                    System.out.println(cardName + " destroyed " + names + "!");
                }
                break;
            case GameConstants.EFFECT_DRAW_CARDS:
                Integer count = (Integer) params.get("count");
                if (count == null) count = 1;
                applyDrawCards(match, event, params);
                System.out.println(cardName + " drew " + count + (count == 1 ? " card." : " cards."));
                break;
            case GameConstants.EFFECT_OPPONENT_DISCARD:
                Integer discardCount = (Integer) params.get("count");
                if (discardCount == null) discardCount = 1;
                applyOpponentDiscard(match, event, params);
                System.out.println(cardName + " made the opponent discard " + discardCount + (discardCount == 1 ? " card." : " cards."));
                break;
            case GameConstants.EFFECT_MOVE_DESTINATION:
                List<CardDTO> moveDestTargets = findTargetCards(match, event, (String) params.get("target"), params);
                String dest = (String) params.get("destination");
                applyMoveDestination(match, event, params);
                if (!moveDestTargets.isEmpty()) {
                    String names = moveDestTargets.stream().map(CardDTO::getName).reduce((a, b) -> a + ", " + b).orElse("");
                    System.out.println(cardName + " moved " + names + " to " + dest + ".");
                }
                break;
            case GameConstants.EFFECT_MOVE_DIRECTION:
                List<CardDTO> moveDirTargets = findTargetCards(match, event, (String) params.get("target"), params);
                String dir = (String) params.get("direction");
                Integer val = (Integer) params.get("value");
                applyMoveDirection(match, event, params);
                if (!moveDirTargets.isEmpty()) {
                    String names = moveDirTargets.stream().map(CardDTO::getName).reduce((a, b) -> a + ", " + b).orElse("");
                    System.out.println(cardName + " moved " + names + " " + dir.toLowerCase() + " by " + val + ".");
                }
                break;
            case GameConstants.EFFECT_SWAP_CONTROL:
                applySwapControl(match);
                System.out.println(cardName + " swapped everyone's cards!");
                break;
            default:
                System.out.println("Unhandled ability effect: " + effect);
                break;
        }
        return new AbilityResult(match, generatedEvents);
    }

    // --- Helper Methods for Effect Categories ---

    private List<GameEvent> applyPowerChange(Match match, GameEvent event, Map<String, Object> params) {
        List<GameEvent> generatedEvents = new ArrayList<>(); // Initialize the result list
        String target = (String) params.get("target");
        Integer value = (Integer) params.get("value");
        String condition = (String) params.get("condition");
        String effect = (String) params.get("effect");
        if (target == null || value == null) {
            System.err.println("Missing parameters for POWER_CHANGE effect.");
            return generatedEvents; // Return empty list
        }
        if (condition != null) {
            boolean conditionMet = checkCondition(match, event, params, condition);
            if (!conditionMet) {
                System.out.println("Condition '" + condition + "' not met for effect " + effect + ". Skipping.");
                return generatedEvents; // Return empty list
            }
        }
        List<CardDTO> targets = findTargetCards(match, event, target, params);
        for (CardDTO card : targets) {
            card.setPower(card.getPower() + value);
        }
        return generatedEvents; // Return the result list
    }

// filepath: c:\Users\lopoc\OneDrive\Desktop\Humber\Semester4\WebDev\Final Project\Triple Siege\CPAN228Final\server\CardGame\src\main\java\com\humber\CardGame\services\game\AbilityExecutionService.java
    // ... inside AbilityExecutionService class ...

    // Return type changed to List<GameEvent>
    private List<GameEvent> applyDestruction(Match match, GameEvent event, Map<String, Object> params) {
        List<GameEvent> deathEvents = new ArrayList<>();
        String target = (String) params.get("target");
        String condition = (String) params.get("condition");
        String effect = (String) params.get("effect");
        if (condition != null) {
            boolean conditionMet = checkCondition(match, event, params, condition);
            if (!conditionMet) {
                System.out.println("Condition '" + condition + "' not met for effect " + effect + ". Skipping.");
                return deathEvents; // Return empty list
            }
        }

        List<CardDTO> targetCards = findTargetCards(match, event, target, params);
        // Iterate over a copy in case the target list overlaps with source list
        for (CardDTO cardToDestroy : new ArrayList<>(targetCards)) {
            RemovalInfo removalInfo = removeCardFromTowers(match, cardToDestroy); // Get removal info
            if (removalInfo.removed) {
                // Card was successfully removed, create a death event
                GameEvent deathEvent = new GameEvent(
                        GameConstants.EVENT_CARD_DESTROYED,
                        cardToDestroy, // Source card is the one that died
                        removalInfo.towerId, // Tower where it died
                        removalInfo.ownerUsername, // Player who owned it
                        match, // Pass current match state (will be updated by dispatcher later)
                        null // No specific context needed here
                );
                deathEvents.add(deathEvent); // Add to list
            }
        }
        return deathEvents; // Return the list of generated death events
    }

    // Updated removeCardFromTowers to return RemovalInfo
    private RemovalInfo removeCardFromTowers(Match match, CardDTO card) {
        int towerIndex = 0;
        for (Tower tower : match.getTowers()) {
            towerIndex++; // 1-based index
            // Check player 1
            if (tower.getPlayer1Cards().removeIf(c -> c.getUid().equals(card.getUid()))) {
                return new RemovalInfo(true, towerIndex, match.getPlayer1());
            }
            // Check player 2
            if (tower.getPlayer2Cards().removeIf(c -> c.getUid().equals(card.getUid()))) {
                return new RemovalInfo(true, towerIndex, match.getPlayer2());
            }
        }
        return new RemovalInfo(false, -1, null); // Not found
    }

    //draw card
    public CardDTO drawCard(List<CardDTO> deck) {
        return deck.removeFirst(); //return null if empty
    }

    private List<GameEvent> applyDrawCards(Match match, GameEvent event, Map<String, Object> params) {
        List<GameEvent> generatedEvents = new ArrayList<>(); // Initialize the result list
        Integer count = (Integer) params.get("count");
        String condition = (String) params.get("condition");
        String effect = (String) params.get("effect");
        if (condition != null) {
            boolean conditionMet = checkCondition(match, event, params, condition);
            if (!conditionMet) {
                System.out.println("Condition '" + condition + "' not met for effect " + effect + ". Skipping.");
                return generatedEvents; // Return empty list
            }
        }
        if (count == null) count = 1;
        boolean isPlayer1 = event.getPlayer().equals(match.getPlayer1());
        List<CardDTO> deck = isPlayer1 ? match.getPlayer1Deck() : match.getPlayer2Deck();
        List<CardDTO> hand = isPlayer1 ? match.getPlayer1Hand() : match.getPlayer2Hand();
        for (int i = 0; i < count && !deck.isEmpty(); i++) {
            hand.add(0, drawCard(deck));
        }
        return generatedEvents; // Return the result list
    }

    private List<GameEvent> applyOpponentDiscard(Match match, GameEvent event, Map<String, Object> params) {
        List<GameEvent> generatedEvents = new ArrayList<>(); // Initialize the result list
        Integer count = (Integer) params.get("count");
        String condition = (String) params.get("condition");
        String effect = (String) params.get("effect");
        if (condition != null) {
            boolean conditionMet = checkCondition(match, event, params, condition);
            if (!conditionMet) {
                System.out.println("Condition '" + condition + "' not met for effect " + effect + ". Skipping.");
                return generatedEvents; // Return empty list
            }
        }
        if (count == null) count = 1;
        boolean isPlayer1 = event.getPlayer().equals(match.getPlayer1());
        List<CardDTO> oppHand = isPlayer1 ? match.getPlayer2Hand() : match.getPlayer1Hand();
        Random rand = new Random();
        for (int i = 0; i < count && !oppHand.isEmpty(); i++) {
            oppHand.remove(rand.nextInt(oppHand.size()));
        }
        return generatedEvents; // Return the result list
    }

    private List<GameEvent> applyMoveDestination(Match match, GameEvent event, Map<String, Object> params) {
        String target = (String) params.get("target");
        String destination = (String) params.get("destination");
        String condition = (String) params.get("condition");
        String effect = (String) params.get("effect");
        List<GameEvent> generatedEvents = new ArrayList<>(); // Initialize the result list
        if (condition != null) {
            boolean conditionMet = checkCondition(match, event, params, condition);
            if (!conditionMet) {
                System.out.println("Condition '" + condition + "' not met for effect " + effect + ". Skipping.");
                return generatedEvents; // Return empty list
            }
        }
        List<CardDTO> cardsToMove = findTargetCards(match, event, target, params);
        if (cardsToMove.isEmpty()) return generatedEvents; // Return empty list
        Tower destTower = null;
        if (GameConstants.DESTINATION_TOWER_WITH_FEWEST_CARDS.equals(destination)) {
            int min = Integer.MAX_VALUE;
            for (Tower t : match.getTowers()) {
                int total = t.getPlayer1Cards().size() + t.getPlayer2Cards().size();
                if (total < min) {
                    min = total;
                    destTower = t;
                }
            }
        }
        if (destTower == null) return generatedEvents; // Return empty list
        for (CardDTO card : cardsToMove) {
            removeCardFromTowers(match, card);
            // Move to same owner stack as before
            boolean isPlayer1 = event.getPlayer().equals(match.getPlayer1());
            if (isPlayer1) destTower.getPlayer2Cards().add(0, card);
            else destTower.getPlayer1Cards().add(0, card);
        }
        return generatedEvents; // Return the result list
    }

    private List<GameEvent> applyMoveDirection(Match match, GameEvent event, Map<String, Object> params) {
        String target = (String) params.get("target");
        String direction = (String) params.get("direction");
        Integer value = (Integer) params.get("value");
        String condition = (String) params.get("condition");
        String effect = (String) params.get("effect");
        List<GameEvent> generatedEvents = new ArrayList<>(); // Initialize the result list
        if (condition != null) {
            boolean conditionMet = checkCondition(match, event, params, condition);
            if (!conditionMet) {
                System.out.println("Condition '" + condition + "' not met for effect " + effect + ". Skipping.");
                return generatedEvents; // Return empty list
            }
        }
        if (direction == null || value == null) return generatedEvents;
        List<CardDTO> cardsToMove = findTargetCards(match, event, target, params);
        Integer towerId = event.getTowerId();
        if (towerId == null) return generatedEvents;
        int newTowerId = direction.equals(GameConstants.DIRECTION_RIGHT) ? towerId + value : towerId - value;
        if (newTowerId < 1 || newTowerId > match.getTowers().size()) return generatedEvents;
        Tower destTower = match.getTowers().get(newTowerId - 1);
        for (CardDTO card : cardsToMove) {
            removeCardFromTowers(match, card);
            boolean isPlayer1 = event.getPlayer().equals(match.getPlayer1());
            if (isPlayer1) destTower.getPlayer1Cards().add(0, card);
            else destTower.getPlayer2Cards().add(0, card);
        }
        return generatedEvents; // Return the result list
    }

    private void applySwapControl(Match match) {
        // No condition on this one for now!!
        for (Tower tower : match.getTowers()) {
            List<CardDTO> p1 = new ArrayList<>(tower.getPlayer1Cards());
            List<CardDTO> p2 = new ArrayList<>(tower.getPlayer2Cards());
            tower.getPlayer1Cards().clear();
            tower.getPlayer2Cards().clear();
            tower.getPlayer1Cards().addAll(p2);
            tower.getPlayer2Cards().addAll(p1);
        }
    }

    // --- Helper Methods for Effect Categories ---

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

            case GameConstants.CONDITION_RED_PRESENT_HERE:
                Integer towerId = event.getTowerId();
                if (towerId == null || towerId < 1 || towerId > match.getTowers().size()) {
                    System.err.println("Cannot check RED_PRESENT_HERE: Invalid towerId.");
                    return false;
                }
                // Check both player's stacks for a red card
                for (var card : match.getTowers().get(towerId - 1).getPlayer1Cards()) {
                    if (card.getColour() != null && card.getColour().equalsIgnoreCase(GameConstants.COLOR_RED)) {
                        return true;
                    }
                }
                for (var card : match.getTowers().get(towerId - 1).getPlayer2Cards()) {
                    if (card.getColour() != null && card.getColour().equalsIgnoreCase(GameConstants.COLOR_RED)) {
                        return true;
                    }
                }
                return false;

            default:
                System.err.println("Unhandled condition type: " + condition);
                return false; // Unknown condition, treat as not met
        }
    }

    // --- Placeholder for target finding logic ---
    private List<CardDTO> findTargetCards(Match match, GameEvent event, String target, Map<String, Object> params) {
        List<CardDTO> foundCards = new ArrayList<>();
        String targetColor = params.get("targetColor") != null ? ((String) params.get("targetColor")).toUpperCase() : null;
        Integer powerThreshold = params.get("powerThreshold") instanceof Integer ? (Integer) params.get("powerThreshold") : null;
        CardDTO sourceCard = event.getSourceCard();
        Integer towerId = event.getTowerId();
        boolean isPlayer1 = event.getPlayer() != null && event.getPlayer().equals(match.getPlayer1());

        // Helper to filter by color and power
        java.util.function.Predicate<CardDTO> colorAndPowerFilter = card -> {
            boolean colorOk = targetColor == null || (card.getColour() != null && card.getColour().equalsIgnoreCase(targetColor));
            boolean powerOk = powerThreshold == null || card.getPower() <= powerThreshold;
            return colorOk && powerOk;
        };

        switch (target) {
            case GameConstants.TARGET_SELF:
                if (sourceCard != null) foundCards.add(sourceCard);
                break;
            case GameConstants.TARGET_CARDS_HERE:
            case GameConstants.TARGET_ALL_CARDS_HERE:
                if (towerId != null && towerId > 0 && towerId <= match.getTowers().size()) {
                    Tower tower = match.getTowers().get(towerId - 1);
                    foundCards.addAll(tower.getPlayer1Cards());
                    foundCards.addAll(tower.getPlayer2Cards());
                }
                break;
            case GameConstants.TARGET_YOUR_CARDS_HERE:
                if (towerId != null && towerId > 0 && towerId <= match.getTowers().size()) {
                    Tower tower = match.getTowers().get(towerId - 1);
                    foundCards.addAll(isPlayer1 ? tower.getPlayer1Cards() : tower.getPlayer2Cards());
                }
                break;
            case GameConstants.TARGET_OPPOSING_CARDS_HERE:
                if (towerId != null && towerId > 0 && towerId <= match.getTowers().size()) {
                    Tower tower = match.getTowers().get(towerId - 1);
                    foundCards.addAll(isPlayer1 ? tower.getPlayer2Cards() : tower.getPlayer1Cards());
                }
                break;
            case GameConstants.TARGET_CARD_BELOW_EVENT_INITIATOR:
                if (towerId != null && towerId > 0 && towerId <= match.getTowers().size() && sourceCard != null) {
                    Tower tower = match.getTowers().get(towerId - 1);
                    List<CardDTO> stack = isPlayer1 ? tower.getPlayer1Cards() : tower.getPlayer2Cards();
                    int idx = -1;
                    for (int i = 0; i < stack.size(); i++) {
                        if (stack.get(i).getUid().equals(sourceCard.getUid())) {
                            idx = i;
                            break;
                        }
                    }
                    if (idx > 0) {
                        foundCards.add(stack.get(idx - 1));
                    }
                }
                break;
            case GameConstants.TARGET_OPPOSING_UNCOVERED_HERE:
            case GameConstants.TARGET_OPPOSING_UNCOVERED_CARD:
                if (towerId != null && towerId > 0 && towerId <= match.getTowers().size()) {
                    Tower tower = match.getTowers().get(towerId - 1);
                    List<CardDTO> oppStack = isPlayer1 ? tower.getPlayer2Cards() : tower.getPlayer1Cards();
                    if (!oppStack.isEmpty()) {
                        CardDTO top = oppStack.get(0);
                        foundCards.add(top);
                    }
                }
                break;
            case GameConstants.TARGET_YOUR_CARDS_HERE_WITH_POWER_LESS_THAN:
                if (towerId != null && towerId > 0 && towerId <= match.getTowers().size() && powerThreshold != null) {
                    Tower tower = match.getTowers().get(towerId - 1);
                    List<CardDTO> yourStack = isPlayer1 ? tower.getPlayer1Cards() : tower.getPlayer2Cards();
                    for (CardDTO card : yourStack) {
                        if (card.getPower() <= powerThreshold) foundCards.add(card);
                    }
                }
                break;
            case GameConstants.TARGET_ALL_UNCOVERED_CARDS:
                for (Tower tower : match.getTowers()) {
                    if (!tower.getPlayer1Cards().isEmpty()) foundCards.add(tower.getPlayer1Cards().get(0));
                    if (!tower.getPlayer2Cards().isEmpty()) foundCards.add(tower.getPlayer2Cards().get(0));
                }
                break;
            case GameConstants.TARGET_ALL_CARDS:
                for (Tower tower : match.getTowers()) {
                    foundCards.addAll(tower.getPlayer1Cards());
                    foundCards.addAll(tower.getPlayer2Cards());
                }
                break;
            default:
                System.err.println("ERROR: Effect has no target type!");
                break;
        }
        // Apply color and power filter if needed
        if (targetColor != null || powerThreshold != null) {
            foundCards.removeIf(card -> !colorAndPowerFilter.test(card));
        }
        return foundCards;
    }
}