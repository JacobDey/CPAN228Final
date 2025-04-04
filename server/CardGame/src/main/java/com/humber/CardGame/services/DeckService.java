package com.humber.CardGame.services;

import com.humber.CardGame.models.Card;
import com.humber.CardGame.models.Deck;
import com.humber.CardGame.models.MyUser;
import com.humber.CardGame.repositories.CardRepository;
import com.humber.CardGame.repositories.DeckRepository;
import com.humber.CardGame.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Optional;

@Service
public class DeckService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    CardRepository cardRepository;
    @Autowired
    DeckRepository deckRepository;

    //create new deck
    public void createNewDeck(String username, String deckName){
        //find user
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        if(userOp.isEmpty()) {
            throw new RuntimeException("username not found");
        }
        MyUser user = userOp.get();

        //create new deck
        Deck deck = new Deck();
        deck.setOwner(username);
        deck.setName(deckName);
        deck.setIcon("default");
        deck.setCardList(new HashMap<>());
        Deck savedDeck = deckRepository.save(deck);

        //add deck to user deck list
        user.getDecks().add(savedDeck);
    }

    //delete deck
    public void deleteDeck(String username, String deckId){
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        if(userOp.isEmpty()) {
            throw new RuntimeException("username not found");
        }
        MyUser user = userOp.get();
        //check if deck exists
        Optional<Deck> deckOp = deckRepository.findByIdAndOwner(deckId,username);
        if(deckOp.isEmpty()) {
            throw new RuntimeException("deck not found");
        }
        Deck deck = deckOp.get();
        //remove deck from user deck list
        user.getDecks().removeIf(d -> d.getId().equals(deckId));
        userRepository.save(user);
        deckRepository.delete(deck);
    }

    //add card to user deck
    public void addCardToDeck(String username, String cardId, String deckId) {
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        Optional<Card> cardOp = cardRepository.findById(cardId);
        if(userOp.isEmpty() || cardOp.isEmpty()) {
            throw new RuntimeException("username or card id not found");
        }
        MyUser user = userOp.get();

        //check if deck exists
        Optional<Deck> deckOp = deckRepository.findByIdAndOwner(deckId,username);
        if(deckOp.isEmpty()) {
            throw new RuntimeException("user does not have a deck with ID:" + deckId);
        }
        Deck deck = deckOp.get();

        //check if user have card
        if(!user.getCards().containsKey(cardId) ||
                user.getCards().get(cardId) <= deck.getCardList().getOrDefault(cardId,0)) {
            throw new RuntimeException("user does not have enough card");
        }

        //check if maximum reach
        if(deck.getCardList().getOrDefault(cardId,0) >= 3) {
            throw new RuntimeException("You can only add 3 of the same card");
        }

        //add card to user deck
        deck.getCardList().put(cardId, deck.getCardList().getOrDefault(cardId,0)+1);

        //save to db
        deckRepository.save(deck);
    }

    //remove card from user deck
    public void removeCardFromDeck(String username, String cardId, String deckId) {
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        Optional<Card> cardOp = cardRepository.findById(cardId);
        if(userOp.isEmpty() || cardOp.isEmpty()) {
            throw new RuntimeException("username or card id not found");
        }

        //check if deck exists
        Optional<Deck> deckOp = deckRepository.findByIdAndOwner(deckId,username);
        if(deckOp.isEmpty()) {
            throw new RuntimeException("user does not have a deck with ID:" + deckId);
        }
        Deck deck = deckOp.get();

        //check if card is in user deck
        if(!deck.getCardList().containsKey(cardId)) {
            throw new RuntimeException("card is not in the deck");
        }

        //check card number
        int count = deck.getCardList().get(cardId)-1;
        //if card = 0 remove it from deck
        if(count <= 0) {
            deck.getCardList().remove(cardId);
        } else {
            deck.getCardList().put(cardId,count);
        }

        //save to db
        deckRepository.save(deck);
    }
}
