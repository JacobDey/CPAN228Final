package com.humber.CardGame.constants;

/**
 * Constants related to game mechanics and the event system
 */
public final class GameConstants {
    // Prevent instantiation
    private GameConstants() {}
    
    // Event types
    public static final String EVENT_CARD_PLAYED = "CARD_PLAYED";
    public static final String EVENT_CARD_DESTROYED = "CARD_DESTROYED";
    public static final String EVENT_TURN_START = "TURN_START";
    public static final String EVENT_TURN_END = "TURN_END";
    
    // Ability triggers
    public static final String TRIGGER_ON_ENTER = "ON_ENTER";
    public static final String TRIGGER_ON_DEATH = "ON_DEATH";
    public static final String TRIGGER_TURN_START = "TURN_START";
    public static final String TRIGGER_TURN_END = "TURN_END";
    public static final String TRIGGER_ON_CARD_DESTROYED = "ON_CARD_DESTROYED";
    
    // Ability effects
    public static final String EFFECT_POWER_CHANGE = "POWER_CHANGE";
    public static final String EFFECT_DESTROY_CARD = "DESTROY_CARD";
    public static final String EFFECT_DESTROY_SELF = "DESTROY_SELF";
    public static final String EFFECT_DESTROY_SELF_IF_OWNERS_TURN = "DESTROY_SELF_IF_OWNERS_TURN";
    public static final String EFFECT_DESTROY_IF_COLOR = "DESTROY_IF_COLOR";
    public static final String EFFECT_DRAW_CARDS = "DRAW_CARDS";
    public static final String EFFECT_MOVE_CARD = "MOVE_CARD";
    public static final String EFFECT_OPPONENT_DISCARD = "OPPONENT_DISCARD";
    public static final String EFFECT_SWAP_CONTROL = "SWAP_CONTROL";
    public static final String EFFECT_DESTROY_CARDS = "DESTROY_CARDS";
    
    // Target types
    public static final String TARGET_SELF = "SELF";
    public static final String TARGET_RED_CARDS_HERE = "RED_CARDS_HERE";
    public static final String TARGET_BLUE_CARDS_HERE = "BLUE_CARDS_HERE";
    public static final String TARGET_YOUR_CARDS_HERE = "YOUR_CARDS_HERE";
    public static final String TARGET_OPPOSING_CARDS_HERE = "OPPOSING_CARDS_HERE";
    public static final String TARGET_CARD_BELOW = "CARD_BELOW";
    public static final String TARGET_ALL_CARDS_HERE = "ALL_CARDS_HERE";
    public static final String TARGET_OPPOSING_UNCOVERED_BLUE = "OPPOSING_UNCOVERED_BLUE";
    public static final String TARGET_LOCATION_TARGET_TOWER = "TARGET_TOWER";
    public static final String TARGET_YOUR_CARDS_HERE_WITH_POWER_LESS_THAN = "YOUR_CARDS_HERE_WITH_POWER_LESS_THAN";
    public static final String TARGET_OPPOSING_UNCOVERED_CARD = "OPPOSING_UNCOVERED_CARD";
    public static final String TARGET_ALL_UNCOVERED_CARDS = "ALL_UNCOVERED_CARDS";
    public static final String TARGET_ALL_CARDS = "ALL_CARDS";
}