package com.humber.CardGame.ai;

public class AIAction {
    private AIActionType type;
    private String cardId;
    private Integer towerId;

    public AIAction(AIActionType type, String cardId, Integer towerId) {
        this.type = type;
        this.cardId = cardId;
        this.towerId = towerId;
    }

    public AIActionType getType() {
        return type;
    }

    public String getCardId() {
        return cardId;
    }

    public Integer getTowerId() {
        return towerId;
    }
}

