import React, { useState } from 'react';
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
import { ThemeProvider } from './contexts/ThemeContext';
export function App() {
  return <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/study-room" element={<StudyRoom />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>;
}