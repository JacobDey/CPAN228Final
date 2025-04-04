package com.humber.CardGame.services.game;

import com.humber.CardGame.models.card.Card;
import com.humber.CardGame.models.card.Deck;
import com.humber.CardGame.models.game.GamePhase;
import com.humber.CardGame.models.game.Match;
import com.humber.CardGame.models.game.MatchStatus;
import com.humber.CardGame.models.game.Tower;
import com.humber.CardGame.models.user.MyUser;
import com.humber.CardGame.repositories.CardRepository;
import com.humber.CardGame.repositories.MatchRepository;
import com.humber.CardGame.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MatchService {

    @Autowired
    private MatchRepository matchRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CardRepository cardRepository;

    //create match
    public Match createMatch(String player1Username) {
        //fetch deck
        MyUser player1 = userRepository.findByUsername(player1Username)
                .orElseThrow(() -> new IllegalArgumentException("Player " + player1Username + " not found"));
        if (player1.getSelectedDeck() == null) {
            throw new IllegalArgumentException("Player has no selected deck");
        }
        //create match
        Match match = new Match();
        match.setPlayer1(player1Username);
        match.setPlayer1Deck(convertDeckToCard(player1.getSelectedDeck())); //set deck
        match.setPlayer1Hand(drawInitialHand(match.getPlayer1Deck())); //set hand
        match.setCurrentTurnPlayer(player1Username);
        match.setStatus(MatchStatus.WAITING);

        // Initialize towers with random victory points
        Random random = new Random();
        for (int i = 1; i <= 3; i++) {
            match.getTowers().add(new Tower(i, random.nextInt(5) + 2, new ArrayList<>(), new ArrayList<>())); // Random 2-6))
        }

        return matchRepository.save(match);
    }

    //join match
    public Match joinMatch(String matchId, String player2Username) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        //check if start
        if(match.getStatus() != MatchStatus.WAITING || match.getPlayer2() != null) {
            throw new RuntimeException("Match is already started");
        }

        //check player2 data
        MyUser player2 = userRepository.findByUsername(player2Username)
                .orElseThrow(() -> new RuntimeException("Player " + player2Username + " not found"));
        if (player2.getSelectedDeck() == null) {
            throw new IllegalArgumentException("Player has no selected deck");
        }
        //add player2 data to match
        match.setPlayer2(player2Username);
        match.setPlayer2Deck(convertDeckToCard(player2.getSelectedDeck())); //set deck
        match.setPlayer2Hand(drawInitialHand(match.getPlayer2Deck())); //set hand
        match.setStatus(MatchStatus.PLAYING);
        match.setCurrentPhase(GamePhase.BEGIN);
        return matchRepository.save(match);
    }

    //start turn
    public Match startTurn(String matchId, String username) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        //validate turn and phase
        if(!match.getCurrentTurnPlayer().equals(username)) {
            throw new RuntimeException("Player " + username + " is not in a turn");
        }
        if(match.getCurrentPhase() != GamePhase.BEGIN) {
            throw new RuntimeException("Can only draw card during begin phase");
        }

        //find user
        boolean isPlayer1 = username.equals(match.getPlayer1());
        //Find card in player hand
        List<Card> playerHand = isPlayer1 ? match.getPlayer1Hand() : match.getPlayer2Hand();
        playerHand.addFirst(drawCard(isPlayer1 ? match.getPlayer1Deck() : match.getPlayer2Deck()));

        return matchRepository.save(match);
    }

    //play card
    public Match playCard(String matchId, String username, String cardId, int towerId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        //validate turn and phase
        if(!match.getCurrentTurnPlayer().equals(username)) {
            throw new RuntimeException("Player " + username + " is not in a turn");
        }
        if(match.getCurrentPhase() != GamePhase.MAIN) {
            throw new RuntimeException("Can only play cards during main phase");
        }
        if(match.getCardPlayedThisTurn() >= 3) {
            throw new RuntimeException("Maximum 3 cards per turn");
        }

        //find user
        boolean isPlayer1 = username.equals(match.getPlayer1());

        //Find card in player hand
        List<Card> playerHand = isPlayer1 ? match.getPlayer1Hand() : match.getPlayer2Hand();

        Optional<Card> cardToPlay = playerHand.stream().filter(c -> c.getId().equals(cardId)).findFirst();
        if(cardToPlay.isEmpty()) {
            throw new RuntimeException("Card not in hand");
        }

        //play card to tower
        Tower tower = match.getTowers().get(towerId-1);
        List<Card> towerCard = isPlayer1 ? tower.getPlayer1Cards() : tower.getPlayer2Cards();
        towerCard.addFirst(cardToPlay.get());

        //remove card from player hand
        playerHand.remove(cardToPlay.get());
        //add card count
        match.setCardPlayedThisTurn(match.getCardPlayedThisTurn()+1);

        return matchRepository.save(match);
    }

    //end turn
    public Match endTurn(String matchId, String username) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        //validate turn
        if(!match.getCurrentTurnPlayer().equals(username)) {
            throw new RuntimeException("Player " + username + " is not in a turn");
        }

        //find user
        boolean isPlayer1 = username.equals(match.getPlayer1());
        //discard down to 7 cards
        List<Card> playerHand = isPlayer1 ? match.getPlayer1Hand() : match.getPlayer2Hand();
        while(playerHand.size() >= 7) {
            playerHand.removeLast();
        }

        //switch turn
        match.setCurrentTurnPlayer( isPlayer1 ? match.getPlayer2() : match.getPlayer1());
        match.setTurn(match.getTurn()+1);
        match.setCurrentPhase(GamePhase.BEGIN);
        match.setCardPlayedThisTurn(0);

        //check for game end
        if( match.getTurn() >= 10) {
            determineWinner(match);
        }

        return matchRepository.save(match);
    }

    //find Winner
    private void determineWinner(Match match) {
        int player1Score = 0;
        int player2Score = 0;

        for(Tower tower : match.getTowers()) {
            int controller = tower.getControllingPlayerId();
            if(controller == 1) {
                player1Score += tower.getVictoryPoints();
            } else if(controller == 2) {
                player2Score += tower.getVictoryPoints();
            }
        }

        if(player1Score > player2Score) {
            match.setStatus(MatchStatus.PLAYER1_WIN);
        } else if(player2Score > player1Score) {
            match.setStatus(MatchStatus.PLAYER2_WIN);
        } else {
            match.setStatus(MatchStatus.DRAW);
        }

    }

    //convert deck to List of Card
    public List<Card> convertDeckToCard(Deck deck) {
        List<Card> cards = new LinkedList<>();
        Map<String, Integer> deckContents = deck.getCardList();
        for(Map.Entry<String,Integer> entry : deckContents.entrySet()) {
            String cardId = entry.getKey();
            int value = entry.getValue();

            //add the card N time based on quantity
            for(int i = 0;i<value;i++) {
                cards.add(cardRepository.findById(cardId)
                        .orElseThrow(() -> new RuntimeException("Card not found")));
            }
        }

        //shuffle card
        Collections.shuffle(cards);
        return cards;
    }

    //draw initial hand
    public List<Card> drawInitialHand(List<Card> deck) {
        List<Card> hand = new ArrayList<>();
        for(int i = 0;i<3 && !deck.isEmpty();i++) {
            hand.add(deck.removeFirst());
        }
        return hand;
    }

    //draw card
    public Card drawCard(List<Card> deck) {
        return deck.removeFirst(); //return null if empty
    }

    //get match
    public Match getMatch(String matchId) {
        return matchRepository.findById(matchId).orElseThrow(() -> new RuntimeException("Match not found"));
    }

}
