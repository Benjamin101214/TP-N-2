import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export function ProtectedRoute({ children }) {
  const { pseudo } = useUser();

  // Si l'utilisateur n'a pas saisi de pseudonyme, redirection immédiate vers l'accueil
  if (!pseudo) {
    return <Navigate to="/" replace />;
  }

  return children;
}