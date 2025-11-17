import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { SunIcon, MoonIcon, MenuIcon, XIcon, LogOutIcon } from 'lucide-react';
const Header: React.FC = () => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const { profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
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
          <div className="hidden md:block relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {profile?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium">{profile?.name || 'User'}</span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                <Link
                  to={`/profile/${profile?.id}`}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setShowUserMenu(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <LogOutIcon size={16} className="mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
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
            <Link to={`/profile/${profile?.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
              My Profile
            </Link>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleSignOut();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-center transition-colors duration-200 flex items-center justify-center"
            >
              <LogOutIcon size={16} className="mr-2" />
              Sign Out
            </button>
          </nav>
        </div>}
    </header>;
};
export default Header;