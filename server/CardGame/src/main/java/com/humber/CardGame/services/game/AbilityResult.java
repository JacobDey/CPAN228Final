package com.humber.CardGame.services.game;

import com.humber.CardGame.models.game.GameEvent;
import com.humber.CardGame.models.game.Match;

import java.util.List;
import java.util.Collections;

// Helper class to return results from ability execution
public class AbilityResult {
    public final Match updatedMatch;
    public final List<GameEvent> generatedEvents;

    public AbilityResult(Match updatedMatch, List<GameEvent> generatedEvents) {
        this.updatedMatch = updatedMatch;
        this.generatedEvents = generatedEvents != null ? generatedEvents : Collections.emptyList();
    }
}