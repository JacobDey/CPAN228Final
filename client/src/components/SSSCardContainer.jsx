import SSSCard from "./SSSCard.jsx";

function SSSCardContainer({cards}){

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