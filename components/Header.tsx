import React, { useState } from 'react';
import { COMPANY_INFO } from '../constants';
import { MenuIcon, XIcon } from './icons';

type Page = 'home' | 'about' | 'products' | 'gallery' | 'news' | 'contact';

interface HeaderProps {
  onNavClick: (page: Page) => void;
}

const navLinks: { page: Page, title: string }[] = [
  { page: 'home', title: '홈' },
  { page: 'about', title: '회사소개' },
  { page: 'products', title: '제품소개' },
  { page: 'gallery', title: '갤러리' },
  { page: 'contact', title: '연락처' },
];

const Header: React.FC<HeaderProps> = ({ onNavClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = (page: Page) => {
    onNavClick(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src={`${import.meta.env.BASE_URL}photo/logo2.png`} alt="The Select Logo" style={{height:100, width:'auto'}} />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => handleLinkClick(link.page)}
                className="text-sm font-medium text-brand-secondary hover:text-brand-accent transition-colors"
              >
                {link.title}
              </button>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-dark">
              {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => handleLinkClick(link.page)}
                className="text-base font-medium text-brand-dark hover:text-brand-accent transition-colors"
              >
                {link.title}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
