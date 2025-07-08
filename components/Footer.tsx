import React from 'react';
import { COMPANY_INFO } from '../constants';
import { YoutubeIcon } from './icons';

type Page = 'home' | 'about' | 'products' | 'gallery' | 'news' | 'contact';

interface FooterProps {
  onNavClick: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-brand-dark text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <h2 className="text-2xl font-serif font-bold text-white">{COMPANY_INFO.name}</h2>
            </div>
            <p className="text-gray-400">{COMPANY_INFO.address}</p>
            <p className="text-gray-400 mt-1">{COMPANY_INFO.phone} | {COMPANY_INFO.email}</p>
            <p className="text-gray-400 mt-1">통신판매업신고번호: 025-인천서구-0873</p>
            <div className="flex items-center justify-center md:justify-start space-x-4 mt-6">
                <a href={COMPANY_INFO.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><YoutubeIcon className="w-6 h-6" /></a>
            </div>
          </div>
          <div>
              <h4 className="font-semibold text-lg mb-4 tracking-wider uppercase">사이트맵</h4>
              <nav className="flex flex-col space-y-2 items-start">
                  <button onClick={() => onNavClick('about')} className="text-gray-400 hover:text-white transition-colors">회사소개</button>
                  <button onClick={() => onNavClick('products')} className="text-gray-400 hover:text-white transition-colors">제품소개</button>
                  <button onClick={() => onNavClick('gallery')} className="text-gray-400 hover:text-white transition-colors">갤러리</button>
              </nav>
          </div>
          <div>
              <h4 className="font-semibold text-lg mb-4 tracking-wider uppercase">고객지원</h4>
              <nav className="flex flex-col space-y-2 items-start">
                 <button onClick={() => onNavClick('contact')} className="text-gray-400 hover:text-white transition-colors">연락처</button>
                 <a href="/admin.html" target="_blank" className="text-gray-400 hover:text-white transition-colors">관리자 페이지</a>
              </nav>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {year} {COMPANY_INFO.name}. All Rights Reserved.</p>
          <p className="text-yellow-300 font-extrabold text-lg mt-2">통신판매업신고번호: 025-인천서구-0873</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;