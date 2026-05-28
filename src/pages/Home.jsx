import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export function Home() {
  const [inputPseudo, setInputPseudo] = useState('');
  const { setPseudo, highScore } = useUser();
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    if (inputPseudo.trim()) {
      setPseudo(inputPseudo.trim());
      navigate('/quiz'); // Déclenche le passage au jeu
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>🏆 Bienvenue sur PolyQuiz 🏆</h2>
      <p>Plateforme de compétition Intellectuelle - Polytechnique Maroua</p>
      
      {highScore > 0 && (
        <p style={{ color: 'gold', fontWeight: 'bold' }}>Votre Meilleur Score Actuel : {highScore} points</p>
      )}

      <form onSubmit={handleStart} style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Entrez votre pseudonyme de niveau expert..."
          value={inputPseudo}
          onChange={(e) => setInputPseudo(e.target.value)}
          required
          style={{ width: '90%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Lancer le défi
        </button>
      </form>
    </div>
  );
}