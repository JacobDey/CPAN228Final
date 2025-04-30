package com.humber.CardGame.ai;

import com.humber.CardGame.models.card.CardAbility;
import com.humber.CardGame.models.card.CardDTO;
import com.humber.CardGame.models.game.Match;
import jakarta.annotation.PostConstruct;
import org.deeplearning4j.nn.multilayer.MultiLayerNetwork;
import org.deeplearning4j.util.ModelSerializer;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.factory.Nd4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class AIPlayerService {

    private MultiLayerNetwork model;
    private boolean modelLoaded = false;

    @PostConstruct
    public void initialize() {
        try {
            //load pre-trained model
            File modelFile = new File("src/main/resources/SSSAI.zip");
            if(modelFile.exists()) {
                this.model = ModelSerializer.restoreMultiLayerNetwork(modelFile);
                modelLoaded = true;
            } else {
                //if no model exists, create a default one later when needed
                System.out.println("No AI model found");
            }
        } catch (IOException e) {
            System.err.println("Error loading AI model: "+e.getMessage());
        }
    }

    public AIAction decideMove(Match match, String aiPlayerName, String difficulty) {
        if(!modelLoaded) {
            //if no model is loaded, use rule-based fallback
            return decideWithRules(match, aiPlayerName, difficulty);
        }

        //convert game state to features
        INDArray features = GameStateConverter.convertMatchToFeatures(match,aiPlayerName);

        //Get model prediction (output is probability distribution over actions)
        INDArray output = model.output(features);

        // convert the highest probability action to game action
        return interpretModelOutput(output,match,aiPlayerName, difficulty);
    }

    private AIAction interpretModelOutput(INDArray output, Match match, String aiPlayerName, String difficulty) {
        //logic to convert model output to game action
        int[] rankedIndices = Nd4j.sortWithIndices(output.dup(), 1, false)[0].toIntVector(); // descending order
        int actionIndex;

        //change action index based on difficulty
        switch (difficulty.toLowerCase()) {
            case "easy":
                actionIndex = rankedIndices[new Random().nextInt(Math.min(3, rankedIndices.length))];
                break;
            case "medium":
                actionIndex = rankedIndices.length >= 2 ? rankedIndices[1] : rankedIndices[0];
                break;
            case "hard":
            default:
                actionIndex = rankedIndices[0];
                break;
        }

        try {
            logMoveForTraining(GameStateConverter.convertMatchToFeatures(match, aiPlayerName), actionIndex);
        } catch (Exception e) {
            e.printStackTrace();
        }

        //logic - will be tailored again
        if(actionIndex < 30) { //play card action
            int cardIndex = actionIndex / 3;
            int towerIndex = actionIndex % 3;

            boolean isPlayer1 = match.getPlayer1().equals(aiPlayerName);
            var hand = isPlayer1 ? match.getPlayer1Hand() : match.getPlayer2Hand();

            if(cardIndex < hand.size()) {
                return new AIAction(
                        AIActionType.PLAY_CARD,
                        hand.get(cardIndex).getUid(),
                        towerIndex+1
                );
            }
        } else {
            //end turn action
            return new AIAction(AIActionType.END_TURN, null, null);
        }

        //fallback to ending turn if no valid action
        return new AIAction(AIActionType.END_TURN, null, null);
    }

    private AIAction decideWithRules(Match match, String aiPlayerName, String difficulty) {
        //rule-based fallback
        // Easy: random card
        // Medium: highest power
        // Hard: destroy-focused, then best power
        boolean isPlayer1 = match.getPlayer1().equals(aiPlayerName);
        var hand = isPlayer1 ? match.getPlayer1Hand() : match.getPlayer2Hand();

        if (!hand.isEmpty() && match.getCardPlayedThisTurn() < 3) {
            if (difficulty.equalsIgnoreCase("hard")) {
                for (CardDTO card : hand) {
                    for (CardAbility ability : card.getAbilities()) {
                        if ("DESTROY_CARD".equalsIgnoreCase((String) ability.getParams().get("effect"))) {
                            return new AIAction(AIActionType.PLAY_CARD, card.getUid(), new Random().nextInt(3) + 1);
                        }
                    }
                }
            }

            CardDTO bestCard = difficulty.equalsIgnoreCase("medium") || difficulty.equalsIgnoreCase("hard")
                    ? hand.stream().max(Comparator.comparingInt(CardDTO::getPower)).orElse(hand.get(0))
                    : hand.get(new Random().nextInt(hand.size()));

            int towerIndex = new Random().nextInt(3) + 1;
            return new AIAction(AIActionType.PLAY_CARD, bestCard.getUid(), towerIndex);
        }

        //end turn if no cards or already play 3
        return new AIAction(AIActionType.END_TURN, null, null);
    }

    private void logMoveForTraining(INDArray features, int actionIndex) {
        String row = Arrays.stream(features.toDoubleVector())
                .mapToObj(String::valueOf)
                .collect(Collectors.joining(",")) + "," + actionIndex;
        try (FileWriter fw = new FileWriter("training_data.csv", true)) {
            fw.write(row + "\n");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
