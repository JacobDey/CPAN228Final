package com.humber.CardGame.models.card;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "cards")
public class Card {
    @Id
    private String id;

    @Indexed(unique = true)
    private String name;
    private String description; // Keeping for backward compatibility
    private String abilityText;
    private String colour;
    private int power;

    private byte[] imageData;
    private String imageType;
    
    // New field for structured card abilities
    private List<CardAbility> abilities = new ArrayList<>();
    
    // Custom getter for description that falls back to abilityText
    public String getDescription() {
        return description != null ? description : abilityText;
    }
    
    // Custom setter for description to keep both fields in sync
    public void setDescription(String description) {
        this.description = description;
        // If abilityText is not set, sync it with description
        if (this.abilityText == null) {
            this.abilityText = description;
        }
    }
    
    // Custom getter for abilityText that falls back to description
    public String getAbilityText() {
        return abilityText != null ? abilityText : description;
    }
    
    // Custom setter for abilityText to keep both fields in sync
    public void setAbilityText(String abilityText) {
        this.abilityText = abilityText;
        // If description is not set, sync it with abilityText
        if (this.description == null) {
            this.description = abilityText;
        }
    }
}
