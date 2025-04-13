package com.humber.CardGame.models.card;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CardDTO {
    private String id;      // Original card ID (from database)
    private String uid;     // Unique instance ID for this card copy
    private String name;
    private String description;
    private String colour;
    private int power;
    
    // Constructor that auto-generates a UID
    public CardDTO(String id, String name, String description, String colour, int power) {
        this.id = id;
        this.uid = UUID.randomUUID().toString();
        this.name = name;
        this.description = description;
        this.colour = colour;
        this.power = power;
    }
}
