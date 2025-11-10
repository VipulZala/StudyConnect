import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon, MenuIcon, XIcon } from 'lucide-react';
const Header: React.FC = () => {
  const {
    theme,
    toggleTheme
  } = useTheme();
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
    name: 'Contact',
    path: '/contact'
  }];
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">SC</span>
          </div>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            StudyConnect
          </span>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map(link => <Link key={link.path} to={link.path} className={`${isActive(link.path) ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'} transition-colors duration-200`}>
              {link.name}
            </Link>)}
        </nav>
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
          </button>
          <Link to="/profile/me" className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            My Profile
          </Link>
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && <div className="md:hidden bg-white dark:bg-gray-800 shadow-md">
          <nav className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={`${isActive(link.path) ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300'} py-2 transition-colors duration-200`} onClick={() => setIsMenuOpen(false)}>
                {link.name}
              </Link>)}
            <Link to="/profile/me" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
              My Profile
            </Link>
          </nav>
        </div>}
    </header>;
};
export default Header;