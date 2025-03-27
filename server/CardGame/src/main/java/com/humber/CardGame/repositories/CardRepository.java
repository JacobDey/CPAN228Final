package com.humber.CardGame.repositories;

import com.humber.CardGame.models.Card;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends MongoRepository<Card, String> {
    List<Card> findByColour(String colour);
    List<Card> findByNameContainingIgnoreCase(String name);
    List<Card> findByPower(int power);
    List<Card> findByPowerBetween(int low, int high);
    List<Card> findByPowerGreaterThan(int power);
    List<Card> findByPowerLessThan(int power);
}
