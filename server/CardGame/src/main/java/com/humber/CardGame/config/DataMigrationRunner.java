// package com.humber.CardGame.config;

// import com.humber.CardGame.models.card.Card;
// import com.humber.CardGame.models.card.CardAbility;
// import com.humber.CardGame.repositories.CardRepository;
// import com.mongodb.client.MongoCollection;
// import com.mongodb.client.MongoDatabase;
// import com.mongodb.client.model.Updates;
// import org.bson.Document;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.data.mongodb.core.MongoTemplate;

// import java.util.*;

// @Configuration
// public class DataMigrationRunner {

    // @Autowired
    // private CardRepository cardRepository;
    
    // @Autowired
    // private MongoTemplate mongoTemplate;

    // @Bean
    // public CommandLineRunner removeDescriptionField() {
    //     return args -> {
    //         System.out.println("Starting removal of 'description' field from cards...");

    //         // Get the collection name for the Card entity
    //         String collectionName = mongoTemplate.getCollectionName(Card.class);
    //         MongoDatabase database = mongoTemplate.getDb();
    //         MongoCollection<Document> collection = database.getCollection(collectionName);

    //         // Create an empty filter to match all documents
    //         Document filter = new Document();

    //         // Create an update operation to unset the 'description' field
    //         var updateResult = collection.updateMany(filter, Updates.unset("description"));

    //         System.out.println("Finished removing 'description' field. Documents modified: " + updateResult.getModifiedCount());
    //     };
    // }

    // @Bean
    // public CommandLineRunner migrateCardData() {
    //     return args -> {
    //         System.out.println("Starting card ability migration...");
            
    //         // Create a map of card names to their abilities
    //         Map<String, List<CardAbility>> abilityMap = createCardAbilityMap();
            
    //         // Get all cards
    //         List<Card> allCards = cardRepository.findAll();
    //         int updatedCount = 0;
            
    //         for (Card card : allCards) {
    //             List<CardAbility> cardAbilities = abilityMap.get(card.getName());
                
    //             // Set specific ability text for all cards
    //             switch(card.getName()) {
    //                 // Red cards
    //                 case "Clumsy Dragon":
    //                     card.setAbilityText("Destroys itself at the beginning of your turn.");
    //                     break;
    //                 case "Hotheaded Loudmouth":
    //                     card.setAbilityText("On enter, blue cards here get -1. On death, blue cards here get +1.");
    //                     break;
    //                 case "Flame Belcher":
    //                     card.setAbilityText("On enter, destroy opposing uncovered blue card");
    //                     break;
    //                 case "Savage Patriot":
    //                     card.setAbilityText("On enter, Savage Patriot destroys the card it's covering if it is blue.");
    //                     break;
    //                 case "Magmatic Boxer":
    //                     card.setAbilityText(""); // No special ability text
    //                     break;
                        
    //                 // Blue cards
    //                 case "Icy Manipulator":
    //                     card.setAbilityText("On enter, red cards here get -1. On death, red cards here get +1.");
    //                     break;
    //                 case "Sacral Healer":
    //                     card.setAbilityText("On enter, your cards with power 2 or less here get +1.");
    //                     break;
    //                 case "Inspiring Squid":
    //                     card.setAbilityText("On enter, your cards here get +1.");
    //                     break;
    //                 case "Gentle Whale":
    //                     card.setAbilityText("On enter, Gentle Whale destroys itself if there is a red card here.");
    //                     break;
    //                 case "Tiger Shark":
    //                     card.setAbilityText(""); // No special ability text
    //                     break;
                        
    //                 // Yellow cards
    //                 case "Martyr's Spirit":
    //                     card.setAbilityText("On enter, Martyr's Spirit destroys the card it is covering.");
    //                     break;
    //                 case "Vengeful Force":
    //                     card.setAbilityText("When a card is destroyed, Vengeful Force gets +1");
    //                     break;
    //                 case "Golden Heart of Balance":
    //                     card.setAbilityText("When a card is destroyed, Golden Heart of Balance destroys itself.");
    //                     break;
    //                 case "East Wind":
    //                     card.setAbilityText("On enter, all cards here move right 1.");
    //                     break;
    //                 case "West Wind":
    //                     card.setAbilityText("On enter, all cards here move left 2.");
    //                     break;
                        
    //                 // Purple cards
    //                 case "Mad King":
    //                     card.setAbilityText("On enter, Mad King destroys every uncovered card.");
    //                     break;
    //                 case "Bloodthirsty Tactician":
    //                     card.setAbilityText("On enter, Bloodthirsty Tactician destroys the opposing uncovered card.");
    //                     break;
                        
    //                 // Green cards
    //                 case "Feeble Elder":
    //                     card.setAbilityText("On enter, draw 4 cards.");
    //                     break;
    //                 case "Studied Wizard":
    //                     card.setAbilityText("On enter, draw 2 cards.");
    //                     break;
    //                 case "Virile Apprentice":
    //                     card.setAbilityText("On enter, draw a card.");
    //                     break;
                        
    //                 // Orange cards
    //                 case "Lightning Bolt":
    //                     card.setAbilityText("On enter, opponent discards a random card.");
    //                     break;
    //                 case "Whirlwind Tornado":
    //                     card.setAbilityText("On enter, move opposing uncovered card here to the tower with the fewest cards.");
    //                     break;
                        
    //                 // White card
    //                 case "Yaldabaoth":
    //                     card.setAbilityText("On enter, swap control of every card on the board, including Yaldabaoth.");
    //                     break;
    //             }
                
    //             if (cardAbilities != null && !cardAbilities.isEmpty()) {
    //                 // Card has abilities, update it
    //                 card.setAbilities(cardAbilities);
                
    //                 cardRepository.save(card);
    //                 updatedCount++;
    //                 System.out.println("Updated abilities for card: " + card.getName());
    //             } else {
    //                 // Card has no abilities, set to empty lists/maps
    //                 card.setAbilities(Collections.emptyList());
    //                 cardRepository.save(card);
    //             }
    //         }
            
    //         System.out.println("Card ability migration complete. Updated " + updatedCount + " cards with abilities.");
    //     };
    // }
    
//     private Map<String, List<CardAbility>> createCardAbilityMap() {
//         Map<String, List<CardAbility>> map = new HashMap<>();
        
//         // RED CARDS
//         // Define abilities for each card
//         map.put("Clumsy Dragon", Collections.singletonList(
//             new CardAbility("TURN_START", "effect", "DESTROY_SELF")
//         ));
        
//         // Multiple abilities for Hotheaded Loudmouth with separate parameters
//         List<CardAbility> hotheadedAbilities = new ArrayList<>();
//         hotheadedAbilities.add(new CardAbility("ON_ENTER", Map.of(
//             "effect", "POWER_CHANGE",
//             "target", "BLUE_CARDS_HERE", 
//             "value", -1
//         )));
//         hotheadedAbilities.add(new CardAbility("ON_DEATH", Map.of(
//             "effect", "POWER_CHANGE",
//             "target", "BLUE_CARDS_HERE",
//             "value", 1
//         )));
//         map.put("Hotheaded Loudmouth", hotheadedAbilities);
        
//         map.put("Flame Belcher", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "DESTROY_CARD",
//                 "target", "OPPOSING_UNCOVERED_BLUE"
//             ))
//         ));
        
//         map.put("Savage Patriot", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "DESTROY_IF_COLOR",
//                 "target", "CARD_BELOW",
//                 "targetColor", "BLUE"
//             ))
//         ));
        
//         map.put("Magmatic Boxer", Collections.emptyList());  // No special abilities
        
//         // BLUE CARDS
//         // Multiple abilities for Icy Manipulator with separate parameters
//         List<CardAbility> icyManipulatorAbilities = new ArrayList<>();
//         icyManipulatorAbilities.add(new CardAbility("ON_ENTER", Map.of(
//             "effect", "POWER_CHANGE",
//             "target", "RED_CARDS_HERE",
//             "value", -1
//         )));
//         icyManipulatorAbilities.add(new CardAbility("ON_DEATH", Map.of(
//             "effect", "POWER_CHANGE",
//             "target", "RED_CARDS_HERE",
//             "value", 1
//         )));
//         map.put("Icy Manipulator", icyManipulatorAbilities);
        
//         map.put("Sacral Healer", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "POWER_CHANGE",
//                 "target", "YOUR_CARDS_HERE_WITH_POWER_LESS_THAN",
//                 "powerThreshold", 2,
//                 "value", 1
//             ))
//         ));
        
//         map.put("Inspiring Squid", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "POWER_CHANGE",
//                 "target", "YOUR_CARDS_HERE",
//                 "value", 1
//             ))
//         ));
        
//         map.put("Gentle Whale", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "DESTROY_SELF_IF_COLOR_HERE",
//                 "targetColor", "RED"
//             ))
//         ));
        
//         map.put("Tiger Shark", Collections.emptyList());  // No special abilities
        
//         // YELLOW CARDS
//         map.put("Martyr's Spirit", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "DESTROY_CARD",
//                 "target", "CARD_BELOW"
//             ))
//         ));
        
//         map.put("Vengeful Force", Collections.singletonList(
//             new CardAbility("ON_CARD_DESTROYED", Map.of(
//                 "effect", "POWER_CHANGE",
//                 "target", "SELF",
//                 "value", 1
//             ))
//         ));
        
//         map.put("Golden Heart of Balance", Collections.singletonList(
//             new CardAbility("ON_CARD_DESTROYED", Map.of(
//                 "effect", "DESTROY_SELF"
//             ))
//         ));
        
//         map.put("East Wind", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "MOVE_CARDS",
//                 "target", "ALL_CARDS_HERE",
//                 "direction", "RIGHT",
//                 "distance", 1
//             ))
//         ));
        
//         map.put("West Wind", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "MOVE_CARDS",
//                 "target", "ALL_CARDS_HERE",
//                 "direction", "LEFT",
//                 "distance", 2
//             ))
//         ));
        
//         // PURPLE CARDS
//         map.put("Mad King", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "DESTROY_CARDS",
//                 "target", "ALL_UNCOVERED_CARDS"
//             ))
//         ));
        
//         map.put("Bloodthirsty Tactician", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "DESTROY_CARD",
//                 "target", "OPPOSING_UNCOVERED_CARD"
//             ))
//         ));
        
//         // GREEN CARDS
//         map.put("Feeble Elder", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "DRAW_CARDS",
//                 "count", 4
//             ))
//         ));
        
//         map.put("Studied Wizard", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "DRAW_CARDS",
//                 "count", 2
//             ))
//         ));
        
//         map.put("Virile Apprentice", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "DRAW_CARDS",
//                 "count", 1
//             ))
//         ));
        
//         // ORANGE CARDS
//         map.put("Lightning Bolt", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "OPPONENT_DISCARD",
//                 "count", 1,
//                 "random", true
//             ))
//         ));
        
//         map.put("Whirlwind Tornado", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "MOVE_CARD",
//                 "target", "OPPOSING_UNCOVERED_CARD",
//                 "destination", "TOWER_WITH_FEWEST_CARDS"
//             ))
//         ));
        
//         // WHITE CARD
//         map.put("Yaldabaoth", Collections.singletonList(
//             new CardAbility("ON_ENTER", Map.of(
//                 "effect", "SWAP_CONTROL",
//                 "target", "ALL_CARDS"
//             ))
//         ));
        
//         return map;
//     }
// }