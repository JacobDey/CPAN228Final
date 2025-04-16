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
    public static final String TRIGGER_ON_CARD_DESTROYED = "ON_CARD_DESTROYED"; // Triggered when any card is destroyed

    // Ability effects
    public static final String EFFECT_POWER_CHANGE = "POWER_CHANGE";
    public static final String EFFECT_DESTROY_CARD = "DESTROY_CARD"; // Handles self, conditional, and mass target destruction
    public static final String EFFECT_DRAW_CARDS = "DRAW_CARDS"; // 
    public static final String EFFECT_MOVE_DESTINATION = "MOVE_DESTINATION"; // RENAMED from MOVE_CARD, handles moving target card(s) to a specific destination tower
    // cards with this target key must also have a destination parameter defined in the constants below
    public static final String EFFECT_MOVE_DIRECTION = "MOVE_DIRECTION"; // RENAMED from MOVE_CARD, handles moving target card(s) either left or right
    // cards with this target key must also have a direction parameter defined in the constants below, and a value parameter for the number of towers to move (either 1 or 2)
    public static final String EFFECT_OPPONENT_DISCARD = "OPPONENT_DISCARD";
    public static final String EFFECT_SWAP_CONTROL = "SWAP_CONTROL";

    // Target types. All of these (except for TARGET_SELF) can be used with a targetColor parameter to specify a color
    public static final String TARGET_SELF = "SELF";
    public static final String TARGET_CARDS_HERE = "CARDS_HERE";
    public static final String TARGET_YOUR_CARDS_HERE = "YOUR_CARDS_HERE";
    public static final String TARGET_OPPOSING_CARDS_HERE = "OPPOSING_CARDS_HERE";
    public static final String TARGET_CARD_BELOW_EVENT_INITIATOR = "CARD_BELOW_EVENT_INITIATOR"; 
    public static final String TARGET_ALL_CARDS_HERE = "ALL_CARDS_HERE";
    public static final String TARGET_OPPOSING_UNCOVERED_HERE = "OPPOSING_UNCOVERED_HERE";
    public static final String TARGET_YOUR_CARDS_HERE_WITH_POWER_LESS_THAN = "YOUR_CARDS_HERE_WITH_POWER_LESS_THAN"; // Card with this target key must also have a powerThreshold parameter with an integer value
    public static final String TARGET_OPPOSING_UNCOVERED_CARD = "OPPOSING_UNCOVERED_CARD";
    public static final String TARGET_ALL_UNCOVERED_CARDS = "ALL_UNCOVERED_CARDS";
    public static final String TARGET_ALL_CARDS = "ALL_CARDS";

    // Parameter Value Constants
    public static final String DESTINATION_TOWER_WITH_FEWEST_CARDS = "TOWER_WITH_FEWEST_CARDS";
    public static final String DIRECTION_RIGHT = "RIGHT";
    public static final String DIRECTION_LEFT = "LEFT";

    // Color Constants
    public static final String COLOR_RED = "RED";
    public static final String COLOR_BLUE = "BLUE";
    public static final String COLOR_YELLOW = "YELLOW";
    public static final String COLOR_PURPLE = "PURPLE";
    public static final String COLOR_GREEN = "GREEN";
    public static final String COLOR_ORANGE = "ORANGE";
    public static final String COLOR_WHITE = "WHITE";

    // Condition Constants, make sure the condition field is passed to effect executors even if not used in that specific case for future extensibility
    public static final String CONDITION_OWNERS_TURN = "OWNERS_TURN"; // For checking if it's the owner of the cards turn
    public static final String CONDITION_RED_PRESENT_HERE = "RED_PRESENT_HERE"; // For checking if a red card exists at the location

}