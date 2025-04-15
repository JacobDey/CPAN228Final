package com.humber.CardGame.models.game;

import com.humber.CardGame.models.card.CardDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameEvent {
    // Event type identifier (e.g., "CARD_PLAYED", "CARD_DESTROYED", etc.)
    private String eventType;

    // The card that triggered the event
    private CardDTO sourceCard;

    // Tower/location information (nullable if not relevant)
    private Integer towerId;

    // Player who triggered the event (username or id)
    private String player;

    // Reference to the match state
    private Match match;

    // Additional context data for ability resolution
    private Map<String, Object> context;
}
