import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SoundProvider } from './context/SoundContext';
import { ClickEffectOverlay } from './components/common/ClickEffectOverlay';
import { AuthModal } from './components/auth/AuthModal';
import { RequireAuth } from './components/auth/RequireAuth';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { QuizListPage } from './pages/QuizListPage';
import { QuizAttemptPage } from './pages/QuizAttemptPage';
import { ResultsPage } from './pages/ResultsPage';
import { CertificatePage } from './pages/CertificatePage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { AdminQuizBuilderPage } from './pages/AdminQuizBuilderPage';
import { AdminAiReviewPage } from './pages/AdminAiReviewPage';
import { ComponentVariantsPage } from './pages/ComponentVariantsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SoundProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-[#111125] text-[#e2e0fc] relative selection:bg-[#ff6b1a] selection:text-white">
            <ClickEffectOverlay />
            <AuthModal />
            <Navbar />
            <main className="flex-1 pt-20">
              <Routes>
                {/* Public Access Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/missions" element={<QuizListPage />} />
                <Route path="/topics/:slug" element={<QuizListPage />} />
                <Route path="/components" element={<ComponentVariantsPage />} />
                <Route path="/variants" element={<ComponentVariantsPage />} />
                <Route path="/certificates/:code/verify" element={<CertificatePage />} />

                {/* Authenticated Shinobi Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <DashboardPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/quiz/:quizId"
                  element={
                    <RequireAuth>
                      <QuizAttemptPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/attempt/:id"
                  element={
                    <RequireAuth>
                      <QuizAttemptPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/results/:submissionId"
                  element={
                    <RequireAuth>
                      <ResultsPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/results/:id"
                  element={
                    <RequireAuth>
                      <ResultsPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/certificate/:code"
                  element={
                    <RequireAuth>
                      <CertificatePage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/certificates/:code"
                  element={
                    <RequireAuth>
                      <CertificatePage />
                    </RequireAuth>
                  }
                />

                {/* Proctor / Admin Restricted Routes */}
                <Route
                  path="/admin"
                  element={
                    <RequireAuth adminOnly={true}>
                      <AdminQuizBuilderPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin/quizzes"
                  element={
                    <RequireAuth adminOnly={true}>
                      <AdminQuizBuilderPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin/reviews"
                  element={
                    <RequireAuth adminOnly={true}>
                      <AdminAiReviewPage />
                    </RequireAuth>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SoundProvider>
    </AuthProvider>
  );
};

export default App;
