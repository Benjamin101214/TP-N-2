import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export function Resultats() {
  const { pseudo, highScore } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  
  // On récupère les scores transmis par le QuizEngine lors de la redirection
  const scoreFinal = location.state?.score || 0;
  const totalQuestions = location.state?.total || 10;

  // État local de pur affichage pour démontrer l'intérêt de useMemo
  const [darkTheme, setDarkTheme] = useState(false);

  // --- JALON 5 : CALCUL LOURD ENVELOPPÉ DANS useMemo ---
  const ratioCalculer = useMemo(() => {
    // Simulation d'un calcul très lourd sur les performances
    let i = 0;
    while (i < 100000000) i++; 
    
    if (totalQuestions === 0) return 0;
    return ((scoreFinal / totalQuestions) * 100).toFixed(2);
  }, [scoreFinal, totalQuestions]); // Ne s'exécutera pas si on change juste le thème !

  return (
    <div style={{
      maxWidth: '500px', 
      margin: '50px auto', 
      padding: '30px', 
      textAlign: 'center', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      backgroundColor: darkTheme ? '#333' : '#fff',
      color: darkTheme ? '#fff' : '#000'
    }}>
      <h2>🏁 Fin de la partie, {pseudo} ! 🏁</h2>
      <p style={{ fontSize: '1.4em' }}>Votre Score sur cette session : <strong>{scoreFinal} / {totalQuestions}</strong></p>
      
      <div style={{ background: '#007bff22', padding: '10px', borderRadius: '4px', margin: '20px 0' }}>
        <p style={{ margin: 0 }}>📊 Ratio de bonnes réponses (calculé via useMemo) : <strong>{ratioCalculer}%</strong></p>
      </div>

      <p>Votre record historique enregistré : <strong>{highScore} points</strong></p>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
        <button onClick={() => navigate('/quiz')} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Rejouer
        </button>
        <button onClick={() => navigate('/')} style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Retour à l'accueil
        </button>
      </div>

      <hr style={{ margin: '30px 0' }} />
      {/* Ce bouton provoque un re-rendu de la page, mais n'exécute PAS à nouveau la boucle lente du ratio */}
      <button onClick={() => setDarkTheme(!darkTheme)} style={{ padding: '5px 10px', fontSize: '0.8em', cursor: 'pointer' }}>
        Changer le thème (Test d'optimisation useMemo)
      </button>
    </div>
  );
}