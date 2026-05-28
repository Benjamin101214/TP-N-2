import React, { createContext, useState, useContext } from 'react';

// 1. Instanciation du contexte global
const UserContext = createContext();

// 2. Développement du composant Provider
export function UserProvider({ children }) {
  const [pseudo, setPseudo] = useState(null);
  const [highScore, setHighScore] = useState(0);

  // Fonction pour mettre à jour le score global si le nouveau est meilleur
  const updateHighScore = (score) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <UserContext.Provider value={{ pseudo, setPseudo, highScore, updateHighScore }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom Hook pour consommer le contexte facilement et proprement
export function useUser() {
  return useContext(UserContext);
}