package com.humber.CardGame.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "decks")
public class Deck {
    @Id
    private String id;
    @DBRef(db = "users", lazy = true)
    private MyUser owner;
    private String name;
    private String icon;
    private Map<String, Integer> cardList;
}
