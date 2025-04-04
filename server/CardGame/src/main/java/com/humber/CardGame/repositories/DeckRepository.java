package com.humber.CardGame.repositories;

import com.humber.CardGame.models.Deck;
import com.humber.CardGame.models.MyUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeckRepository extends MongoRepository<Deck, String> {
    Optional<Deck> findByIdAndOwner(String id, MyUser owner);
}
