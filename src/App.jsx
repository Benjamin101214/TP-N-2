import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { QuizEngine } from './pages/QuizEngine';
import { Resultats } from './pages/Resultats';

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Route d'accueil : aucune restriction */}
          <Route path="/" element={<Home />} />
          
          {/* Route du jeu : protégée */}
          <Route 
            path="/quiz" 
            element={
              <ProtectedRoute>
                <QuizEngine />
              </ProtectedRoute>
            } 
          />

          {/* Route des résultats : protégée */}
          <Route 
            path="/resultats" 
            element={
              <ProtectedRoute>
                <Resultats />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}