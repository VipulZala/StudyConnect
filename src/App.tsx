import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Connections from './pages/Connections';
import Projects from './pages/Projects';
import Messaging from './pages/Messaging';
import StudyRoom from './pages/StudyRoom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import OAuthSuccess from './pages/OAuthSuccess';
import ProtectedRoute from './components/ProtectedRoute';

import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
export function App() {
  return <ThemeProvider>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </ThemeProvider>;
}

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex vh-100 align-items-center justify-content-center bg-body">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-body text-body transition-colors duration-200">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/messaging" element={<Messaging />} />
            <Route path="/study-room" element={<StudyRoom />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/auth/success" element={<OAuthSuccess />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}