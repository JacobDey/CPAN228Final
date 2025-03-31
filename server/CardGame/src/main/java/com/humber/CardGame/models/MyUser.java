package com.humber.CardGame.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
public class MyUser {
    @Id
    private String id;
    private String role; // will have USER, ADMIN

    @Indexed(unique = true)
    private String username;
    private String password;

    @Indexed(unique = true)
    private String email;
    private Date createdAt;
//    private Date lastLoginAt;
    private Map<Card, Integer> cards;
    private Map<Card, Integer> deck;
}
