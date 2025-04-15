package com.humber.CardGame.repositories;

import com.humber.CardGame.models.game.Match;
import com.humber.CardGame.models.game.MatchStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends MongoRepository<Match, String> {
    List<Match> findByStatus(MatchStatus status);
}
