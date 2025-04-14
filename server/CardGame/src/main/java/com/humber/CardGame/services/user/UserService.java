package com.humber.CardGame.services.user;


import com.humber.CardGame.config.JwtUtil;
import com.humber.CardGame.models.card.Card;
import com.humber.CardGame.models.card.Deck;
import com.humber.CardGame.models.user.MyUser;
import com.humber.CardGame.models.user.UserProfileDTO;
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
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("username already exists");
        }
        //check if email existed
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("email already exists");
        }
        //encrypt password
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRole("USER"); //set role
        /* Set starter deck
        3x Magmatic Boxer
        3x Tiger Shark
        3x Inspiring Squid
        3x Feeble Elder
        3x Sacral Healer
        3x Gentle Whale
        3x Martyr’s Spirit*/
        Map<String, Integer> startDeck = new HashMap<>();
        startDeck.put("67e9d0c59a7f463f2f43aa8f",3);
        startDeck.put("67e9d0c59a7f463f2f43aa94",3);
        startDeck.put("67e9d0c59a7f463f2f43aa92",3);
        startDeck.put("67e9d0c59a7f463f2f43aa9c",3);
        startDeck.put("67e9d0c59a7f463f2f43aa91",3);
        startDeck.put("67e9d0c59a7f463f2f43aa93",3);
        startDeck.put("67e9d0c59a7f463f2f43aa95",3);
        user.setCards(startDeck);
        Deck deck = new Deck();
        deck.setOwner(user.getUsername());
        deck.setCardList(new HashMap<>(startDeck));
        deck.setName("StarterDeck");
        deck.setIcon("Default");
        deckRepository.save(deck);
        user.setSelectedDeck(deck);
        List<Deck> decks = new ArrayList<>();
        decks.add(deck);
        user.setDecks(decks);
        //save user
        userRepository.save(user);

        deckRepository.save(deck);
    }

    //login and return jwt token
    public String login(String username, String password) {
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        if (userOp.isPresent()) {
            MyUser user = userOp.get();
            if (bCryptPasswordEncoder.matches(password, user.getPassword())) {
                return jwtUtil.generateToken(user.getUsername());
            }
        }
        throw new RuntimeException("Invalid username or password");
    }

    //    get user cards
    public Map<String, Integer> getUserCards(String username) {
        //find user by username
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        //if username is not found
        if (userOp.isEmpty()) {
            throw new RuntimeException("username not found");
        }
        //return list of cards
        return userOp.get().getCards();
    }


    //Set selected deck
    public void setSelectedDeck(String username, String deckId) {
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        if (userOp.isEmpty()) {
            throw new RuntimeException("username not found");
        }
        MyUser user = userOp.get();
        //check if deck exists
        Optional<Deck> deckOp = deckRepository.findByIdAndOwner(deckId, username);
        if (deckOp.isEmpty()) {
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
        if (userOp.isEmpty()) {
            throw new RuntimeException("username not found");
        }
        MyUser user = userOp.get();
        if (user.getSelectedDeck() == null) {
            throw new RuntimeException("No deck selected");
        }
        return user.getSelectedDeck();
    }

    //get all decks
    public List<Deck> getUserDecks(String username) {
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        if (userOp.isEmpty()) {
            throw new RuntimeException("username not found");
        }
        return userOp.get().getDecks();
    }

    //add card to user cards
    public void addCard(String username, String cardId) {
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        Optional<Card> cardOp = cardRepository.findById(cardId);
        if (userOp.isEmpty() || cardOp.isEmpty()) {
            throw new RuntimeException("username or card id not found");
        }
        MyUser user = userOp.get();

        //add card to user card list
        user.getCards().put(cardId, user.getCards().getOrDefault(cardId, 0) + 1);
        //save to db
        userRepository.save(user);
    }

    //add cards to user cards (Open booster pack)
    public void addCards(String username, List<String> cardIds) {
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        if (userOp.isEmpty()) {
            throw new RuntimeException("username not found");
        }
        MyUser user = userOp.get();
        for(String cardId : cardIds) {
            Optional<Card> cardOp = cardRepository.findById(cardId);
            if (cardOp.isEmpty()) {
                throw new RuntimeException("card not found");
            }
            user.getCards().put(cardId, user.getCards().getOrDefault(cardId, 0) + 1);
        }
        userRepository.save(user);
    }

    //get user profile
    public UserProfileDTO getUserProfile(String username) {
        //find user by username
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        if (userOp.isEmpty()) {
            throw new RuntimeException("username not found");
        }
        MyUser user = userOp.get();
        //return new DTO for user
        return new UserProfileDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.getCards(),
                user.getDecks(),
                user.getSelectedDeck(),
                user.getMatchesHistory()
        );
    }
}
