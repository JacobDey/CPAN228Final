package com.humber.CardGame.services.game;

import com.humber.CardGame.constants.GameConstants;
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
        // Only trigger ON_ENTER abilities when the event is CARD_PLAYED
        List<CardAbility> triggeredAbilities = sourceCard.getAbilities().stream()
                .filter(ability -> GameConstants.EVENT_CARD_PLAYED.equals(event.getEventType()) &&
                        GameConstants.TRIGGER_ON_ENTER.equals(ability.getAbilityType()))
                .collect(Collectors.toList());

        Match match = event.getMatch();
        for (CardAbility ability : triggeredAbilities) {
            match = abilityExecutionService.executeAbility(event, ability);
        }
        return match;
    }
}
