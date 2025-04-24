import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import LoginPage from '@/pages/LoginPage';
import AppPage from '@/pages/AppPage';
import DashboardPage from '@/pages/DashboardPage';
import ConverterPage from '@/pages/ConverterPage';
import ProcessPage from '@/pages/ProcessPage';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import CookiesPage from '@/pages/CookiesPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />

      <Route path="/app" element={
        <PrivateRoute>
          <AppPage />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="converter" element={<ConverterPage />} />
        <Route path="process/:projectId" element={<ProcessPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/termos" element={<TermsPage />} />
      <Route path="/privacidade" element={<PrivacyPage />} />
      <Route path="/cookies" element={<CookiesPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 