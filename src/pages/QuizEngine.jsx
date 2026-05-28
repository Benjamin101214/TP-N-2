import React, { useReducer, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useUser } from '../context/UserContext';

// --- JALON 4 : REDUCER EXTERNE ---
const initialState = {
  currentQuestionIndex: 0,
  score: 0,
  isFinished: false,
  answers: []
};

function quizReducer(state, action) {
  switch (action.type) {
    case 'START_QUIZ':
      return { ...initialState };

    case 'ANSWER_QUESTION': {
      const { selectedAnswer, correctAnswer } = action.payload;
      const isCorrect = selectedAnswer === correctAnswer;
      const nextIndex = state.currentQuestionIndex + 1;
      
      return {
        ...state,
        score: isCorrect ? state.score + 1 : state.score,
        currentQuestionIndex: nextIndex,
        answers: [...state.answers, selectedAnswer]
      };
    }

    case 'FINISH_QUIZ':
      return {
        ...state,
        isFinished: true
      };

    default:
      return state;
  }
}

export function QuizEngine() {
  const { pseudo, updateHighScore } = useUser();
  const navigate = useNavigate();
  
  // Récupération des données via le Custom Hook (Jalon 1)
  const { data: questions, loading, error } = useFetch('/questions.json');
  
  // Initialisation de la machine à état complexe
  const [state, dispatch] = useReducer(quizReducer, initialState);
  
  // --- JALON 5 : LE CHRONOMÈTRE (useRef) ---
  const [timeLeft, setTimeLeft] = React.useState(60);
  const timerRef = useRef(null); // Stocke l'ID du setInterval sans déclencher de re-rendu

  useEffect(() => {
    // Lancement du compte à rebours dès le chargement du composant
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          dispatch({ type: 'FINISH_QUIZ' });
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Fonction de nettoyage (Cleanup) pour éviter les fuites de mémoire
    return () => clearInterval(timerRef.current);
  }, []);

  // Déclencheur lorsque le jeu est terminé par manque de temps ou fin de questions
  useEffect(() => {
    if (questions && (state.currentQuestionIndex >= questions.length || state.isFinished)) {
      clearInterval(timerRef.current); // Nettoyage de sécurité
      updateHighScore(state.score); // Sauvegarde du score dans le contexte
      
      // On redirige vers la page de résultats en passant le score final et le total de questions dans l'état de navigation
      navigate('/resultats', { 
        state: { score: state.score, total: questions.length } 
      });
    }
  }, [state.currentQuestionIndex, state.isFinished, questions, state.score, navigate, updateHighScore]);

  if (loading) return <div style={{ padding: '20px' }}>Chargement des questions de PolyQuiz...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Erreur : {error}</div>;
  if (!questions || questions.length === 0) return null;

  const currentQuestion = questions[state.currentQuestionIndex];

  // Empêche un crash si la transition vers l'écran de fin est en cours
  if (!currentQuestion) return null;

  const handleAnswerSubmit = (option) => {
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: {
        selectedAnswer: option,
        correctAnswer: currentQuestion.bonne_reponse
      }
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span>Joueur : <strong>{pseudo}</strong></span>
        <span style={{ color: timeLeft < 15 ? 'red' : 'green', fontWeight: 'bold' }}>
          ⏱️ Temps restant : {timeLeft}s
        </span>
      </div>

      <p style={{ fontSize: '0.9em', color: '#666' }}>Catégorie : {currentQuestion.categorie}</p>
      <h3>Question {state.currentQuestionIndex + 1}/{questions.length}</h3>
      <p style={{ fontSize: '1.2em' }}>{currentQuestion.libelle}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSubmit(option)}
            style={{ padding: '12px', cursor: 'pointer', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'left' }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}