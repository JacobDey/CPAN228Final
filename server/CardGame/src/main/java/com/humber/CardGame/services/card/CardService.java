package com.humber.CardGame.services.card;


import com.humber.CardGame.models.card.Card;
import com.humber.CardGame.repositories.CardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CardService {

//    repository injection
    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    // get all cards
    public List<Card> getAllCard() {
        return cardRepository.findAll();
    }

    //get a card by id
    public Optional<Card> getCardById(String id) {
        return cardRepository.findById(id);
    }

    //get filtered card
    public List<Card> getCardByName(String name) {
        return cardRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Card> getCardByColour(String colour) {
        return cardRepository.findByColourIgnoreCase(colour);
    }

    public List<Card> getCardByPower(int power) {
        return cardRepository.findByPower(power);
    }
    public List<Card> getCardByPower(int minPower, int maxPower) {
        return cardRepository.findByPowerBetween(minPower-1, maxPower+1);
    }

    public List<Card> getCardByMaxPower(int maxPower) {
        return cardRepository.findByPowerLessThanEqual(maxPower);
    }

    public List<Card> getCardByMinPower(int minPower) {
        return cardRepository.findByPowerGreaterThanEqual(minPower);
    }

    // add card to the db
    public void saveCardToDatabase(Card card) {
        //check name
        if(cardRepository.findByNameIgnoreCase(card.getName()) != null) {
            throw new IllegalStateException("Card already exists!");
        }
        cardRepository.save(card);
    }

    //remove card from db
    public void deleteCardFromDatabase(String cardId) {
        //check id
        if(cardRepository.findById(cardId).isEmpty()) {
            throw new IllegalStateException("Card does not exist!");
        }
        cardRepository.deleteById(cardId);
    }

    //edit card data
    public void editCardData(Card card) {
        // check id
        if(cardRepository.findById(card.getId()).isEmpty()) {
            throw new IllegalStateException("Card does not exist!");
        }
        cardRepository.save(card);
    }

}
