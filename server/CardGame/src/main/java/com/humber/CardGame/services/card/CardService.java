package com.humber.CardGame.services.card;


import com.humber.CardGame.models.card.Card;
import com.humber.CardGame.models.card.CardDTO;
import com.humber.CardGame.repositories.CardRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CardService {

    //    repository injection
    private final CardRepository cardRepository;
    private final MongoTemplate mongoTemplate;
    private static final List<String> COLOR_ORDER = List.of(
            "Red", "Blue", "Yellow", "Purple", "Green", "Orange", "White"
    );

    public CardService(CardRepository cardRepository, MongoTemplate mongoTemplate) {
        this.cardRepository = cardRepository;
        this.mongoTemplate = mongoTemplate;
    }

    //change card to CardDTO
    public List<CardDTO> convertCards(List<Card> cards) {
        return cards.stream()
                .map(card -> new CardDTO(
                        card.getId(),
                        card.getName(),
                        card.getAbilityText(),
                        card.getColour(),
                        card.getPower(),
                        card.getAbilities() // Pass abilities directly to constructor
                ))
                .collect(Collectors.toList());
    }

    //get all cards
    public List<CardDTO> getAllCard() {
        return convertCards(cardRepository.findAll());
    }

    // get all cards with paginated
    public Page<CardDTO> getAllCard(Pageable pageable) {
        return paginated(pageable, cardRepository.findAll());
    }

    //get random cards
    public List<CardDTO> getRandomCard(int count) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.sample(count)
        );

        AggregationResults<Card> results = mongoTemplate.aggregate(aggregation, "cards", Card.class);
        return convertCards(results.getMappedResults());
    }

    //get a card by id
    public Optional<Card> getCardById(String id) {
        return cardRepository.findById(id);
    }

    //get multiple card with multiple ids
    public List<CardDTO> getCardsByIds(List<String> cardIds) {
        List<Card> cards = cardRepository.findAllById(cardIds);
        return convertCards(cards);
    }

    //get filtered card
    public Page<CardDTO> getCardByName(String name,Pageable pageable) {
        return paginated(pageable, cardRepository.findByNameContainingIgnoreCase(name));
    }

    public Page<CardDTO> getCardByColour(String colour,Pageable pageable) {
        return paginated(pageable, cardRepository.findByColourIgnoreCase(colour));
    }

    public Page<CardDTO> getCardByPower(int power,Pageable pageable) {
        return paginated(pageable, cardRepository.findByPower(power));
    }

    public Page<CardDTO> getCardByPower(int minPower, int maxPower,Pageable pageable) {
        return paginated(pageable, cardRepository.findByPowerBetween(minPower - 1, maxPower + 1));
    }

    public Page<CardDTO> getCardByMaxPower(int maxPower,Pageable pageable) {
        return paginated(pageable, cardRepository.findByPowerLessThanEqual(maxPower));
    }

    public Page<CardDTO> getCardByMinPower(int minPower,Pageable pageable) {
        return paginated(pageable, cardRepository.findByPowerGreaterThanEqual(minPower));
    }

    // add card to the db
    public void saveCardToDatabase(Card card) {
        //check name
        if (cardRepository.findByNameIgnoreCase(card.getName()) != null) {
            throw new IllegalStateException("Card already exists!");
        }
        cardRepository.save(card);
    }

    //remove card from db
    public void deleteCardFromDatabase(String cardId) {
        //check id
        if (cardRepository.findById(cardId).isEmpty()) {
            throw new IllegalStateException("Card does not exist!");
        }
        cardRepository.deleteById(cardId);
    }

    //edit card data
    public void editCardData(Card card) {
        // check id
        if (cardRepository.findById(card.getId()).isEmpty()) {
            throw new IllegalStateException("Card does not exist!");
        }
        cardRepository.save(card);
    }

    //paginated function
    public Page<CardDTO> paginated(Pageable pageable, List<Card> cards) {
        // Get the sort direction and field
        Sort.Order sortOrder = pageable.getSort().stream().findFirst().orElse(null);

        // Apply sorting if sort order exists
        if (sortOrder != null) {
            String sortField = sortOrder.getProperty();
            Sort.Direction direction = sortOrder.getDirection();

            if ("colour".equalsIgnoreCase(sortField)) {
                cards = colourSort(pageable, cards);
            } else {
                cards.sort((c1, c2) -> switch (sortField.toLowerCase()) {
                    case "power" -> direction == Sort.Direction.ASC
                            ? Integer.compare(c1.getPower(), c2.getPower())
                            : Integer.compare(c2.getPower(), c1.getPower());
                    case "name" -> direction == Sort.Direction.ASC
                            ? c1.getName().compareToIgnoreCase(c2.getName())
                            : c2.getName().compareToIgnoreCase(c1.getName());
                    default -> 0; // no sorting
                });
            }
        }

        // Handle pagination
        int totalElements = cards.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), totalElements);

        // Get the sublist for the current page
        List<Card> pageContent = totalElements <= start ? List.of() : cards.subList(start, end);

        // Create Page with converted DTOs, using the original total elements count
        return new PageImpl<>(convertCards(pageContent), pageable, totalElements);
    }

    //custom sort for colour
    public List<Card> colourSort(Pageable pageable,List<Card> cards) {
        Sort.Direction direction = Objects.requireNonNull(pageable.getSort().getOrderFor("colour")).getDirection();
        cards.sort((c1,c2) -> {
            int index1 = COLOR_ORDER.indexOf(c1.getColour());
            int index2 = COLOR_ORDER.indexOf(c2.getColour());

            //handle colour not in list
            if(index1 == -1 || index2 == -1) {
                return c1.getColour().compareToIgnoreCase(c2.getColour());
            }

            return direction == Sort.Direction.ASC ? Integer.compare(index1,index2) : Integer.compare(index2,index1);
        });
        return cards;
    }


}
