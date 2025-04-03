import { useState } from 'react'
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

function App() {
  return (
    <Router>
      <div>
        <SSSNavbar />
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/collection" element={<SSSCollection />} />
          <Route path="/decks" element={<SSSDecks />} />
          <Route path="/cards" element={<SSSCards />} />
          <Route path="/battle" element={<SSSBattle />} />
          <Route path="/card/:id" element={<SSSCardDetails />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
