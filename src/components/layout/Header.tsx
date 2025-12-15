import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { SunIcon, MoonIcon, MenuIcon, XIcon, LogOutIcon } from 'lucide-react';


const Header: React.FC = () => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const {
    user,
    logout
  } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navLinks = [{
    name: 'Home',
    path: '/'
  }, {
    name: 'About',
    path: '/about'
  }, {
    name: 'Connections',
    path: '/connections'
  }, {
    name: 'Projects',
    path: '/projects'
  }, {
    name: 'Messages',
    path: '/messaging'
  }, {
    name: 'Study Room',
    path: '/study-room'
  }, {
    name: 'Profile',
    path: '/profile'
  }, {
    name: 'Contact',
    path: '/contact'
  }];
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <header className="navbar navbar-expand-md bg-body-tertiary shadow-sm">
    <div className="container-fluid px-4">
      <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
        <div className="d-flex align-items-center justify-content-center bg-primary rounded-circle" style={{ width: '40px', height: '40px' }}>
          <span className="text-white fw-bold fs-5">SC</span>
        </div>
        <span className="fs-4 fw-bold text-primary">
          StudyConnect
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="d-none d-md-flex justify-content-center flex-grow-1">
        <nav className="d-flex gap-4">
          {navLinks.map(link => <Link key={link.path} to={link.path} className={`nav-link ${isActive(link.path) ? 'active text-primary fw-medium' : 'text-secondary'}`}>
            {link.name}
          </Link>)}
        </nav>
      </div>

      <div className="d-flex align-items-center gap-3">
        <button onClick={toggleTheme} className="btn btn-link p-2 text-body" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
        </button>
        {user ? <div className="d-none d-md-flex align-items-center gap-3">
          <Link to="/profile" className="d-flex align-items-center gap-2 text-decoration-none text-body">
            <span className="fw-medium">Welcome, {user.name}</span>
          </Link>
          <button onClick={logout} className="btn btn-link p-2 text-body" aria-label="Logout">
            <LogOutIcon size={20} />
          </button>
        </div> : <div className="d-none d-md-flex align-items-center gap-2">
          <Link to="/login" className="btn btn-link text-secondary text-decoration-none">
            Sign in
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Sign up
          </Link>
        </div>}
        {/* Mobile menu button */}
        <button className="d-md-none btn btn-link p-2 text-body" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>
    </div>
    {/* Mobile Navigation */}
    {isMenuOpen && <div className="d-md-none w-100 bg-body-tertiary border-top">
      <nav className="container-fluid px-4 py-3 d-flex flex-column gap-2">
        {navLinks.map(link => <Link key={link.path} to={link.path} className={`nav-link ${isActive(link.path) ? 'text-primary fw-medium' : 'text-secondary'}`} onClick={() => setIsMenuOpen(false)}>
          {link.name}
        </Link>)}
        {user ? <>
          <Link to="/profile/me" className="d-flex align-items-center gap-2 py-2 text-decoration-none text-body" onClick={() => setIsMenuOpen(false)}>
            <img src={user.avatar || 'https://via.placeholder.com/32'} alt={user.name} className="rounded-circle" style={{ width: '32px', height: '32px' }} />
            <span className="fw-medium">{user.name}</span>
          </Link>
          <button onClick={() => {
            logout();
            setIsMenuOpen(false);
          }} className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2">
            <LogOutIcon size={18} /> Logout
          </button>
        </> : <>
          <Link to="/login" className="nav-link text-secondary" onClick={() => setIsMenuOpen(false)}>
            Sign in
          </Link>
          <Link to="/signup" className="btn btn-primary w-100" onClick={() => setIsMenuOpen(false)}>
            Sign up
          </Link>
        </>}
      </nav>
    </div>}
  </header>;
};
export default Header;