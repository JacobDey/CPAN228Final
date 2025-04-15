package com.humber.CardGame.services.game;

import com.humber.CardGame.models.card.Card;
import com.humber.CardGame.models.card.CardDTO;
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
        //create a new match as player 1
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

    //get all matches
    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    //join match that has not yet started as player 2
    public Match joinMatch(String matchId, String player2Username) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));


        // removing this for now, i think that you should be able to rejoin a match if you disconnect for
        //check if start
        if (match.getStatus() != MatchStatus.WAITING || match.getPlayer2() != null) {
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

    //join an ongoing match as player 1 or 2
    public Match joinOngoingMatch(String matchId, String username) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        // Verify the user is one of the players in this match
        if (!username.equals(match.getPlayer1()) && !username.equals(match.getPlayer2())) {
            throw new RuntimeException("You are not a player in this match");
        }

        // Check if the match is in PLAYING status
        if (match.getStatus() != MatchStatus.PLAYING) {
            // If the match is in WAITING status and the user is player1, just return the match
            if (match.getStatus() == MatchStatus.WAITING && username.equals(match.getPlayer1())) {
                return match;
            }
            throw new RuntimeException("This match cannot be joined at this time");
        }

        // No need to modify the match state, just return it
        return match;
    }

    //start turn
    public Match startTurn(String matchId, String username) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        //validate turn and phase
        if (!match.getCurrentTurnPlayer().equals(username)) {
            throw new RuntimeException("Player " + username + " is not in a turn");
        }
        if (match.getCurrentPhase() != GamePhase.BEGIN) {
            throw new RuntimeException("Can only draw card during begin phase");
        }

        //find user
        boolean isPlayer1 = username.equals(match.getPlayer1());
        //Find card in player hand
        List<CardDTO> playerHand = isPlayer1 ? match.getPlayer1Hand() : match.getPlayer2Hand();
        playerHand.addFirst(drawCard(isPlayer1 ? match.getPlayer1Deck() : match.getPlayer2Deck()));

        // Set phase to MAIN after drawing
        match.setCurrentPhase(GamePhase.MAIN);

        return matchRepository.save(match);
    }

    //play card
    public Match playCard(String matchId, String username, String cardId, int towerId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        //validate turn and phase
        if (!match.getCurrentTurnPlayer().equals(username)) {
            throw new RuntimeException("Player " + username + " is not in a turn");
        }
        if (match.getCurrentPhase() != GamePhase.MAIN) {
            throw new RuntimeException("Can only play cards during main phase");
        }
        if (match.getCardPlayedThisTurn() >= 3) {
            throw new RuntimeException("Maximum 3 cards per turn");
        }

        //find user
        boolean isPlayer1 = username.equals(match.getPlayer1());

        //Find card in player hand
        List<CardDTO> playerHand = isPlayer1 ? match.getPlayer1Hand() : match.getPlayer2Hand();

        // Using card's uid instead of id for finding the specific card instance
        Optional<CardDTO> cardToPlay = playerHand.stream().filter(c -> c.getUid().equals(cardId)).findFirst();
        if (cardToPlay.isEmpty()) {
            throw new RuntimeException("Card not in hand");
        }

        //play card to tower
        Tower tower = match.getTowers().get(towerId - 1);
        List<CardDTO> towerCard = isPlayer1 ? tower.getPlayer1Cards() : tower.getPlayer2Cards();
        towerCard.addFirst(cardToPlay.get());

        //remove card from player hand
        playerHand.remove(cardToPlay.get());
        //add card count
        match.setCardPlayedThisTurn(match.getCardPlayedThisTurn() + 1);

        return matchRepository.save(match);
    }

    //end turn
    public Match endTurn(String matchId, String username) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        //validate turn
        if (!match.getCurrentTurnPlayer().equals(username)) {
            throw new RuntimeException("Player " + username + " is not in a turn");
        }

        //find user
        boolean isPlayer1 = username.equals(match.getPlayer1());
        //discard down to 7 cards
        List<CardDTO> playerHand = isPlayer1 ? match.getPlayer1Hand() : match.getPlayer2Hand();
        while (playerHand.size() >= 7) {
            playerHand.removeLast();
        }

        //switch turn
        match.setCurrentTurnPlayer(isPlayer1 ? match.getPlayer2() : match.getPlayer1());
        match.setTurn(match.getTurn() + 1);
        match.setCurrentPhase(GamePhase.BEGIN);
        match.setCardPlayedThisTurn(0);

        //check for game end
        if (match.getTurn() >= 10) {
            determineWinner(match);
        }

        return matchRepository.save(match);
    }

    //find Winner
    private void determineWinner(Match match) {

        MyUser player1 = userRepository.findByUsername(match.getPlayer1())
                .orElseThrow(() -> new RuntimeException("Player " + match.getPlayer1() + " not found"));

        MyUser player2 = userRepository.findByUsername(match.getPlayer2())
                .orElseThrow(() -> new RuntimeException("Player " + match.getPlayer2() + " not found"));

        int player1Score = 0;
        int player2Score = 0;

        int winnerCredit = 300;
        int loserCredit = 3;
        int drawCredit = 30;

        for (Tower tower : match.getTowers()) {
            int controller = tower.getControllingPlayerId();
            if (controller == 1) {
                player1Score += tower.getVictoryPoints();
            } else if (controller == 2) {
                player2Score += tower.getVictoryPoints();
            }
        }

        if (player1Score > player2Score) {
            match.setStatus(MatchStatus.PLAYER1_WIN);
            player1.setCredit(player1.getCredit()+winnerCredit);
            player2.setCredit(player2.getCredit()+loserCredit);
        } else if (player2Score > player1Score) {
            match.setStatus(MatchStatus.PLAYER2_WIN);
            player1.setCredit(player1.getCredit()+loserCredit);
            player2.setCredit(player2.getCredit()+winnerCredit);
        } else {
            match.setStatus(MatchStatus.DRAW);
            player1.setCredit(player1.getCredit()+drawCredit);
            player2.setCredit(player2.getCredit()+drawCredit);
        }

        //save score to match
        match.setPlayer1Score(player1Score);
        match.setPlayer2Score(player2Score);

        //save match to user history
        player1.getMatchesHistory().addFirst(match);
        player2.getMatchesHistory().addFirst(match);

        userRepository.save(player1);
        userRepository.save(player2);

        //set game state to end
        match.setCurrentPhase(GamePhase.END);
        match.setCurrentTurnPlayer(null);

    }

    //convert deck to List of Card
    public List<CardDTO> convertDeckToCard(Deck deck) {
        List<CardDTO> cards = new LinkedList<>();
        Map<String, Integer> deckContents = deck.getCardList();
        for (Map.Entry<String, Integer> entry : deckContents.entrySet()) {
            String cardId = entry.getKey();
            int value = entry.getValue();

            //add the card N time based on quantity
            for (int i = 0; i < value; i++) {
                Card card = cardRepository.findById(cardId)
                        .orElseThrow(() -> new RuntimeException("Card not found"));

                cards.add(new CardDTO(
                        card.getId(),
                        card.getName(),
                        card.getAbilityText(),
                        card.getColour(),
                        card.getPower(),
                        card.getAbilities()
                ));
            }
        }

        //shuffle card
        Collections.shuffle(cards);
        return cards;
    }

    //draw initial hand
    public List<CardDTO> drawInitialHand(List<CardDTO> deck) {
        List<CardDTO> hand = new ArrayList<>();
        for (int i = 0; i < 3 && !deck.isEmpty(); i++) {
            hand.add(deck.removeFirst());
        }
        return hand;
    }

    //draw card
    public CardDTO drawCard(List<CardDTO> deck) {
        return deck.removeFirst(); //return null if empty
    }

    //get match
    public Match getMatch(String matchId) {
        return matchRepository.findById(matchId).orElseThrow(() -> new RuntimeException("Match not found"));
    }

    //get ongoing match
    public List<Match> getOngoingMatches() {
        return matchRepository.findByStatus(MatchStatus.PLAYING);
    }

}
