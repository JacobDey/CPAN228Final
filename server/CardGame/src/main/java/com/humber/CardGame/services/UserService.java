package com.humber.CardGame.services;


import com.humber.CardGame.config.JwtUtil;
import com.humber.CardGame.models.Card;
import com.humber.CardGame.models.Deck;
import com.humber.CardGame.models.MyUser;
import com.humber.CardGame.repositories.CardRepository;
import com.humber.CardGame.repositories.DeckRepository;
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
    private final DeckRepository deckRepository;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder
            , JwtUtil jwtUtil, CardRepository cardRepository, DeckRepository deckRepository) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtUtil = jwtUtil;
        this.cardRepository = cardRepository;
        this.deckRepository = deckRepository;
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



    //Set selected deck
    public void setSelectedDeck(String username, String deckId){
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        if(userOp.isEmpty()) {
            throw new RuntimeException("username not found");
        }
        MyUser user = userOp.get();
        //check if deck exists
        Optional<Deck> deckOp = deckRepository.findByIdAndOwner(deckId,user);
        if(deckOp.isEmpty()) {
            throw new RuntimeException("deck not found");
        }
        Deck deck = deckOp.get();
        //set selected deck
        user.setSelectedDeck(deck);
        userRepository.save(user);
    }

    //get user's selected deck
    public Deck getUserDeck(String username) {
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        if(userOp.isEmpty()) {
            throw new RuntimeException("username not found");
        }
        MyUser user = userOp.get();
        if(user.getSelectedDeck() == null) {
            throw new RuntimeException("No deck selected");
        }
        return user.getSelectedDeck();
    }

    //get all decks
    public List<Deck> getUserDecks(String username){
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        if(userOp.isEmpty()) {
            throw new RuntimeException("username not found");
        }
        return userOp.get().getDecks();
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
}
