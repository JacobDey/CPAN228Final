package com.humber.CardGame.services;


import com.humber.CardGame.config.JwtUtil;
import com.humber.CardGame.models.Card;
import com.humber.CardGame.models.MyUser;
import com.humber.CardGame.repositories.CardRepository;
import com.humber.CardGame.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    //injection
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JwtUtil jwtUtil;
    private final CardRepository cardRepository;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, JwtUtil jwtUtil, CardRepository cardRepository) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtUtil = jwtUtil;
        this.cardRepository = cardRepository;
    }

    //save user to db
    public void saveUser(MyUser user) {
        //check if username existed
        if(userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("username already exists");
        }
        //check if email existed
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("email already exists");
        }
        //encrypt password
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRole("USER");

        //save user
        userRepository.save(user);
    }

    //login and return jwt token
    public String login(String username, String password) {
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        if(userOp.isPresent()) {
            MyUser user = userOp.get();
            if(bCryptPasswordEncoder.matches(password, user.getPassword())) {
                return jwtUtil.generateToken(user.getUsername());
            }
        }
        throw new RuntimeException("Invalid username or password");
    }

//    get user cards
    public Map<String,Integer> getUserCards(String username) {
        //find user by username
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        //if username is not found
        if(userOp.isEmpty()) {
            throw new RuntimeException("username not found");
        }
        //return list of cards
        return userOp.get().getCards();
    }

    //get user deck
    public Map<String,Integer> getUserDeck(String username) {
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        if(userOp.isEmpty()) {
            throw new RuntimeException("username not found");
        }
        return userOp.get().getDeck();
    }

    //add card to user cards
    public void addCard(String username, String cardId) {
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        Optional<Card> cardOp = cardRepository.findById(cardId);
        if(userOp.isEmpty() || cardOp.isEmpty()) {
            throw new RuntimeException("username or card id not found");
        }
        MyUser user = userOp.get();

        //add card to user card list
        user.getCards().put(cardId,user.getCards().getOrDefault(cardId,0) + 1);
        //save to db
        userRepository.save(user);
    }

    //add card to user deck
    public void addCardToDeck(String username, String cardId) {
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        Optional<Card> cardOp = cardRepository.findById(cardId);
        if(userOp.isEmpty() || cardOp.isEmpty()) {
            throw new RuntimeException("username or card id not found");
        }
        MyUser user = userOp.get();

        //check if user have card
        if(!user.getCards().containsKey(cardId) ||
                user.getCards().get(cardId) <= user.getDeck().getOrDefault(cardId,0)) {
            throw new RuntimeException("user do not have enough card");
        }

        //check if maximum reach
        if(user.getDeck().getOrDefault(cardId,0) > 3) {
            throw new RuntimeException("You can only add 3 of the same card");
        }

        //add card to user deck
        user.getDeck().put(cardId, user.getDeck().getOrDefault(cardId,0)+1);

        //save to db
        userRepository.save(user);
    }

    //remove card from user deck
    public void removeCardFromDeck(String username, String cardId) {
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        Optional<Card> cardOp = cardRepository.findById(cardId);
        if(userOp.isEmpty() || cardOp.isEmpty()) {
            throw new RuntimeException("username or card id not found");
        }

        MyUser user = userOp.get();

        //check if card is in user deck
        if(!user.getDeck().containsKey(cardId)) {
            throw new RuntimeException("card is not in the deck");
        }

        //remove card from deck
        user.getDeck().put(cardId, user.getCards().get(cardId)-1);

        //if number reach 0 remove it from deck
        if(user.getCards().get(cardId) <= 0) {
            user.getDeck().remove(cardId);
        }
        //save to db
        userRepository.save(user);
    }
}
