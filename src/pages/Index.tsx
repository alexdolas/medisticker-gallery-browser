
import React from 'react';
import { StickersProvider } from '../contexts/StickersContext';
import Header from '../components/Header';
import TagFilter from '../components/TagFilter';
import StickerGrid from '../components/StickerGrid';

const Index = () => {
  return (
    <StickersProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Medical Sticker Gallery</h2>
            <p className="text-gray-600 mb-4">Browse and search through a collection of 2600+ medical stickers for healthcare professionals.</p>
            
            <TagFilter />
          </div>
          
          <StickerGrid />
        </main>
        
        <footer className="mt-12 py-6 border-t bg-white">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600">
            <p>Medical Sticker Gallery © {new Date().getFullYear()}</p>
            <p className="mt-1">A searchable collection of medical stickers for healthcare professionals</p>
          </div>
        </footer>
      </div>
    </StickersProvider>
  );
};

export default Index;
