package com.humber.CardGame.services.game;

import com.humber.CardGame.models.card.CardAbility;
import com.humber.CardGame.models.card.CardDTO;
import com.humber.CardGame.models.game.GameEvent;
import com.humber.CardGame.models.game.Match;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class GameEventDispatcher {
    @Autowired
    private AbilityExecutionService abilityExecutionService;

    /**
     * Dispatches a game event, triggers relevant abilities, and returns the updated match state.
     * @param event The game event to process
     * @return The updated Match object
     */
    public Match dispatchEvent(GameEvent event) {
        CardDTO sourceCard = event.getSourceCard();
        if (sourceCard == null || sourceCard.getAbilities() == null) {
            return event.getMatch();
        }
        // Find abilities that should trigger for this event type
        List<CardAbility> triggeredAbilities = sourceCard.getAbilities().stream()
                .filter(ability -> Objects.equals(ability.getAbilityType(), event.getEventType()))
                .collect(Collectors.toList());

        // Forward each triggered ability to the AbilityExecutionService (stub)
        Match match = event.getMatch();
        for (CardAbility ability : triggeredAbilities) {
            // In a real implementation, this would update the match state
            match = abilityExecutionService.executeAbility(event, ability);
        }
        return match;
    }
}
