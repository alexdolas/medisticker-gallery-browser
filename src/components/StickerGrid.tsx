
import React, { useState } from 'react';
import { useStickers } from '../contexts/StickersContext';
import StickerCard from './StickerCard';
import StickerPreview from './StickerPreview';
import { StickerData } from '../types';

const StickerGrid: React.FC = () => {
  const { filteredStickers, isLoading } = useStickers();
  const [selectedSticker, setSelectedSticker] = useState<StickerData | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  
  const handleStickerClick = (sticker: StickerData) => {
    setSelectedSticker(sticker);
  };
  
  const closePreview = () => {
    setSelectedSticker(null);
  };
  
  // Calculate displayed stickers based on pagination
  const displayedStickers = filteredStickers.slice(0, page * itemsPerPage);
  const hasMore = displayedStickers.length < filteredStickers.length;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-medical-200 mb-2"></div>
          <div className="text-medical-600">Loading stickers...</div>
        </div>
      </div>
    );
  }
  
  if (!isLoading && filteredStickers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-xl font-medium text-gray-600 mb-2">No stickers found</div>
        <div className="text-gray-500">Try adjusting your search or filters</div>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayedStickers.map((sticker) => (
          <StickerCard
            key={sticker.id}
            sticker={sticker}
            onClick={handleStickerClick}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-medical-100 text-medical-800 hover:bg-medical-200 rounded-md text-sm font-medium"
          >
            Load More
          </button>
        </div>
      )}
      
      {selectedSticker && (
        <StickerPreview
          sticker={selectedSticker}
          onClose={closePreview}
        />
      )}
    </>
  );
};

export default StickerGrid;
