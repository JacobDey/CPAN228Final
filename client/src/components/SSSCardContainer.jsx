import SSSCard from "./SSSCard.jsx";

function SSSCardContainer({cards}){
    return(
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
            padding: '20px'
        }}>
            {cards.map((cardData) => (
                <SSSCard key={cardData.id} data={cardData} />
            ))}
        </div>
    );
}

export default SSSCardContainer;