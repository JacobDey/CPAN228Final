import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from "./pages/MainMenu.jsx";
import './App.css'
import SSSNavbar from "./components/SSSNavbar";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SSSCollection from "./pages/SSSCollection.jsx";
import SSSDecks from "./pages/SSSDecks.jsx";
import SSSCards from "./pages/SSSCards.jsx";
import SSSBattle from "./pages/SSSBattle.jsx";
import SSSCardDetails from "./pages/SSSCardDetails.jsx";
import SSSDeckDetail from './pages/SSSDeckDetail.jsx';
import CardManage from './pages/admin/CardManage.jsx';
import SSSBoosterPack from './pages/SSSBoosterPack.jsx';
import SSSGame from './pages/SSSGame.jsx';
import SSSBackground from './components/SSSBackground.jsx';
import SSSProfile from './pages/SSSProfile.jsx';

function App() {
  return (
    <Router>
      <div className='relative'>
        {/* BG */}
        <SSSBackground />
        {/* Nav Bar */}
        <div className=''>
          <SSSNavbar />
        </div>
        {/* Routes */}
        <div className="relative z-10" style={{ marginTop: '60px' }}>
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/collection" element={<SSSCollection />} />
            <Route path="/decks" element={<SSSDecks />} />
            <Route path="/decks/:deckId" element={<SSSDeckDetail />} />
            <Route path="/cards" element={<SSSCards />} />
            <Route path="/battle" element={<SSSBattle />} />
            <Route path="/card/:id" element={<SSSCardDetails />} />
            <Route path="/booster" element={<SSSBoosterPack />} />
            <Route path="/admin/edit/cards" element={<CardManage />} />
            <Route path="/game/:matchId" element={<SSSGame />} />
            <Route path="/profile" element={<SSSProfile />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App