package com.humber.CardGame.models.card;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CardDTO {
    private String id;      // Original card ID (from database)
    private String uid;     // Unique instance ID for this card copy
    private String name;
    private String abilityText;
    private String colour;
    private int power;
    
    // New field for structured abilities
    private List<CardAbility> abilities = new ArrayList<>();

//constructor with new ability structure
    public CardDTO(String id, String name, String abilityText, String colour, int power, 
                List<CardAbility> abilities) {
        this.id = id;
        this.uid = UUID.randomUUID().toString();
        this.name = name;
        this.abilityText = abilityText;
        this.colour = colour;
        this.power = power;
        this.abilities = abilities;
    }
}
