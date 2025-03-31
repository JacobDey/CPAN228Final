import SSSCard from "./SSSCard.jsx";

function SSSCardContainer(){
    const cards = [
        {cardName: 'Dragon', cardPower: 5, cardDescription: 'This is a dragon', cardColour: 'red'},
        {cardName: 'Siren', cardPower: 4, cardDescription: 'Fish lady', cardColour: 'blue'},
        {cardName: 'Goblin', cardPower: 3, cardDescription: 'You know what this is', cardColour: 'black'}
    ];

    return(
        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
            {
                cards.map((cardData, cardIndex) => (
                    <SSSCard data={cardData} index={cardIndex} />
                ))
            }
        </div>
    );
}

export default SSSCardContainer;