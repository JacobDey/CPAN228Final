package com.humber.CardGame.models;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "cards")
public class Card {
    @Id
    private String id;

    @Indexed(unique = true)
    private String name;
    private String description;
    private String colour;
    private int power;
    private String image;
    //private byte[] imageData;
    //private String imageType;
}
