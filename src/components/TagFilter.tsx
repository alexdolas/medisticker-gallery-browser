
import React from 'react';
import { useStickers } from '../contexts/StickersContext';

const TagFilter: React.FC = () => {
  const { popularTags, selectedTags, addSelectedTag } = useStickers();
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {popularTags.map((tag) => (
          <button
            key={tag}
            onClick={() => addSelectedTag(tag)}
            disabled={selectedTags.includes(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? 'bg-medical-600 text-white cursor-default'
                : 'bg-medical-100 text-medical-800 hover:bg-medical-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
