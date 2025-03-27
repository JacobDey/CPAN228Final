package com.humber.CardGame.services;


import com.humber.CardGame.models.Card;
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
        return cardRepository.findByColour(colour);
    }

    public List<Card> getCardByPower(int power) {
        return cardRepository.findByPower(power);
    }
    public List<Card> getCardByPower(int maxPower, int minPower) {
        return cardRepository.findByPowerBetween(minPower, maxPower);
    }

    public List<Card> getCardByMaxPower(int maxPower) {
        return cardRepository.findByPowerLessThan(maxPower);
    }

    public List<Card> getCardByMinPower(int minPower) {
        return cardRepository.findByPowerGreaterThan(minPower);
    }


}
