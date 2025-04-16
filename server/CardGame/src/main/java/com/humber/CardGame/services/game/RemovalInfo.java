package com.humber.CardGame.services.game;

// Helper class to store info about a removed card
public class RemovalInfo {
    final boolean removed;
    final int towerId; // 1-based index
    final String ownerUsername;

    public RemovalInfo(boolean removed, int towerId, String ownerUsername) {
        this.removed = removed;
        this.towerId = towerId;
        this.ownerUsername = ownerUsername;
    }
}