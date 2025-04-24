import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AppPage from '@/pages/AppPage';
import ConverterPage from '@/pages/ConverterPage';
import ProcessPage from '@/pages/ProcessPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/privacidade" element={<PrivacyPage />} />
      <Route path="/termos" element={<TermsPage />} />

      {/* Rotas protegidas */}
      <Route
        path="/app"
        element={user ? <AppPage /> : <Navigate to="/login" replace />}
      >
        <Route index element={<ConverterPage />} />
        <Route path="process/:projectId" element={<ProcessPage />} />
      </Route>

      {/* Rota de fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 