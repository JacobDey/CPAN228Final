package com.humber.CardGame.ai;

import org.deeplearning4j.nn.conf.*;
import org.deeplearning4j.nn.conf.layers.*;
import org.deeplearning4j.nn.multilayer.MultiLayerNetwork;
import org.deeplearning4j.optimize.listeners.ScoreIterationListener;
import org.deeplearning4j.datasets.datavec.RecordReaderDataSetIterator;
import org.deeplearning4j.util.ModelSerializer;

import org.datavec.api.records.reader.impl.csv.CSVRecordReader;
import org.datavec.api.split.FileSplit;
import org.nd4j.linalg.activations.Activation;
import org.nd4j.linalg.dataset.api.iterator.DataSetIterator;
import org.nd4j.linalg.dataset.api.preprocessor.NormalizerStandardize;
import org.nd4j.linalg.learning.config.Adam;
import org.nd4j.linalg.lossfunctions.LossFunctions;

import java.io.File;

public class AITrainer {
    public static void main(String[] args) throws Exception {
        int numInputs = 20; // GameStateConverter feature count
        int numOutputs = 31; // 30 play actions + 1 end turn
        int batchSize = 64;
        int epochs = 10;

        //read input
        CSVRecordReader recordReader = new CSVRecordReader(0, ',');
        recordReader.initialize(new FileSplit(new File("training_data.csv")));
        DataSetIterator iterator = new RecordReaderDataSetIterator(recordReader, batchSize, numInputs, numOutputs);

        //normalize input
        NormalizerStandardize normalizer = new NormalizerStandardize();
        normalizer.fit(iterator);
        iterator.setPreProcessor(normalizer);

        //define neural network
        MultiLayerConfiguration config = new NeuralNetConfiguration.Builder()
                .updater(new Adam(0.001))
                .list()
                .layer(new DenseLayer.Builder().nIn(numInputs).nOut(64).activation(Activation.RELU).build())
                .layer(new DenseLayer.Builder().nOut(64).activation(Activation.RELU).build())
                .layer(new OutputLayer.Builder().nOut(numOutputs).activation(Activation.SOFTMAX)
                        .lossFunction(LossFunctions.LossFunction.NEGATIVELOGLIKELIHOOD).build())
                .build();

        MultiLayerNetwork model = new MultiLayerNetwork(config);
        model.init();
        model.setListeners(new ScoreIterationListener(10));

        for (int i = 0; i < epochs; i++) {
            iterator.reset();
            model.fit(iterator);
        }

        // Save it
        ModelSerializer.writeModel(model, new File("src/main/resources/SSSAI.zip"), true);
        System.out.println("AI model trained and saved.");
    }
}
