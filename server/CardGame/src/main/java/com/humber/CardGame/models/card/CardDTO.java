package com.humber.CardGame.models.card;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CardDTO {
    private String id;
    private String name;
    private String description;
    private String colour;
    private int power;
}
