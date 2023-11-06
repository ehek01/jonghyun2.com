import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';
import LunchPage from "./pages/LunchPage";

export default function App() {
    return (
      <Router>
          <Routes>
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/lunch" element={<LunchPage />} />
              <Route path="/" element={<HomePage />} />
          </Routes>
      </Router>
    );
}
