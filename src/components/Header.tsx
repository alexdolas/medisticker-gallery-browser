
import React from 'react';
import { useStickers } from '../contexts/StickersContext';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  const { filteredStickers } = useStickers();
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-medical-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">MS</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Medical Sticker Gallery
            </h1>
          </div>
          
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>
          
          <div className="text-sm text-gray-600">
            {filteredStickers.length} stickers available
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
