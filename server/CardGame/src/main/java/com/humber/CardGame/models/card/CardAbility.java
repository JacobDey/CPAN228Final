package com.humber.CardGame.models.card;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CardAbility {
    private String abilityType;
    private Map<String, Object> params = new HashMap<>();
    
    // Convenience constructor for simple abilities
    public CardAbility(String abilityType, String effectKey, Object effectValue) {
        this.abilityType = abilityType;
        this.params = new HashMap<>();
        this.params.put(effectKey, effectValue);
    }
}