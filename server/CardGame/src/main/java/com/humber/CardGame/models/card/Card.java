package com.humber.CardGame.models.card;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Range;
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
    @NotBlank(message = "Card name is required")
    private String name;
    private String abilityText;

    @NotBlank(message = "Card colour is required")
    private String colour;
    @NotNull(message = "Card power is required")
    @Range(min = 0, max = 99, message = "Power must be between 0 - 99")
    private int power;

    private byte[] imageData;
    private String imageType;
    
    // New field for structured card abilities
    private List<CardAbility> abilities = new ArrayList<>();
    
    
}
