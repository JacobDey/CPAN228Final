# Triple Siege Card Game

A strategic card battling game where players vie for control of three mystical towers through tactical card placement and ability management.

## 🏰 About The Game

Triple Siege is an epic strategic card game where dominance isn't just claimed—it's earned through superior tactics and foresight. Players compete to control three towers of varying point values by deploying cards with unique abilities and strengths over the course of five intense turns.

### Game Features:

- **Dynamic Tower Values**: Each tower is worth between 2-6 victory points, forcing players to adapt strategies based on high-value targets
- **Color-based Card System**: Cards utilize three primary colors (Red, Blue, Yellow) and their hybrid combinations (Purple, Green, Orange), each with unique strengths and abilities
- **5-Turn Strategic Battles**: Compact gameplay where every decision carries significant weight
- **Unique Card Abilities**: Low-power cards grant special advantages while high-power cards offer raw strength with drawbacks
- **3-Phase Turn Structure**: Draw, play up to 3 cards, and discard down to 7 cards

## 💻 Technical Stack

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context API

### Backend
- **Framework**: Java Spring Boot
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: WebSockets for gameplay

### Database
- **MongoDB**: Document-oriented NoSQL database

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Java JDK 17+
- MongoDB
- Maven

### Installation

#### Backend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/your-username/triple-siege.git
   cd your folder/server/CardGame
   ```

2. Configure MongoDB connection in `application.properties`

3. Build and run the Spring Boot application
   ```bash
   mvn spring-boot:run
   ```

#### Frontend Setup
1. Navigate to the frontend directory
   ```bash
   cd ../client
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your backend URL.

4. Start the development server
   ```bash
   npm run dev
   ```

## 🎮 How to Play

Triple Siege follows a precise three-phase turn structure:

1. **Beginning Phase**: Draw a card from your deck
2. **Main Phase**: Play up to 3 cards in any order, activate abilities and resolve effects
3. **End Phase**: Discard down to 7 cards in hand

### Strategic Considerations

- Each tower's worth ranges from 2-6 victory points
- The 3-card limit per turn forces tough decisions about resource allocation
- Cards with low power grant special advantages while high-power cards offer raw strength at a cost
- Control is determined by raw power, but clever abilities can turn the tide
- The game ends after 5 turns, when tower control is calculated and the victor emerges

### Card Colors and Their Strategies

#### Primary Colors
- **Red**: Aggressive, hurts the opponent
- **Blue**: Defensive, helps the player
- **Yellow**: Movement, symmetrical effects

#### Hybrid Colors
- **Purple (Red + Blue)**: Royalty, powerful and commanding
- **Green (Blue + Yellow)**: Knowledge, card draw and wizardry
- **Orange (Yellow + Red)**: Control, discard and creature movement

## 🛠️ Project Structure

```
triple-siege/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── triplesiege/
│   │   │   │           ├── config/
│   │   │   │           ├── controllers/
│   │   │   │           ├── models/
│   │   │   │           ├── repositories/
│   │   │   │           ├── security/
│   │   │   │           ├── services/
│   │   │   │           └── websocket/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are issued upon successful login
- Access tokens expire after a set period
- Protected routes require valid tokens
- WebSocket connections are secured

## 🎲 Game Logic Implementation

- The game state is maintained on the server
- Game actions are validated server-side to prevent cheating
- WebSockets enable real-time gameplay and updates
- The server manages turn transitions and win conditions

## 🚧 Development Roadmap

- [x] Card design and game mechanics
- [x] User authentication system
- [x] Basic gameplay implementation
- [x] Deck building functionality
- [x] Card collection system
- [x] Matchmaking system
- [x] Friend challenges
- [ ] Rating and leaderboards
- [ ] Mobile responsiveness

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Jacob Dey
- Chanon Palawatvichai
- Tanner Stephenson
