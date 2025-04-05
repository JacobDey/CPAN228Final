package com.humber.CardGame.services.card;


import com.humber.CardGame.models.card.Card;
import com.humber.CardGame.models.card.CardDTO;
import com.humber.CardGame.repositories.CardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;

@Service
public class CardService {

    //    repository injection
    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    //change card to CardDTO
    public List<CardDTO> convertCards(List<Card> cards) {
        return cards.stream()
                .map(card -> new CardDTO(
                        card.getId(),
                        card.getName(),
                        card.getDescription(),
                        card.getColour(),
                        card.getPower()
                ))
                .collect(Collectors.toList());
    }

    // get all cards
    public List<CardDTO> getAllCard() {
        return convertCards(cardRepository.findAll());
    }

    //get a card by id
    public Optional<Card> getCardById(String id) {
        return cardRepository.findById(id);
    }

    //get filtered card
    public List<CardDTO> getCardByName(String name) {
        return convertCards(cardRepository.findByNameContainingIgnoreCase(name));
    }

    public List<CardDTO> getCardByColour(String colour) {
        return convertCards(cardRepository.findByColourIgnoreCase(colour));
    }

    public List<CardDTO> getCardByPower(int power) {
        return convertCards(cardRepository.findByPower(power));
    }

    public List<CardDTO> getCardByPower(int minPower, int maxPower) {
        return convertCards(cardRepository.findByPowerBetween(minPower - 1, maxPower + 1));
    }

    public List<CardDTO> getCardByMaxPower(int maxPower) {
        return convertCards(cardRepository.findByPowerLessThanEqual(maxPower));
    }

    public List<CardDTO> getCardByMinPower(int minPower) {
        return convertCards(cardRepository.findByPowerGreaterThanEqual(minPower));
    }

    // add card to the db
    public void saveCardToDatabase(Card card) {
        //check name
        if (cardRepository.findByNameIgnoreCase(card.getName()) != null) {
            throw new IllegalStateException("Card already exists!");
        }
        cardRepository.save(card);
    }

    //remove card from db
    public void deleteCardFromDatabase(String cardId) {
        //check id
        if (cardRepository.findById(cardId).isEmpty()) {
            throw new IllegalStateException("Card does not exist!");
        }
        cardRepository.deleteById(cardId);
    }

    //edit card data
    public void editCardData(Card card) {
        // check id
        if (cardRepository.findById(card.getId()).isEmpty()) {
            throw new IllegalStateException("Card does not exist!");
        }
        cardRepository.save(card);
    }

}
