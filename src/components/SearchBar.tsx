
import React, { useState, useEffect, useRef } from 'react';
import { useStickers } from '../contexts/StickersContext';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    allTags, 
    selectedTags,
    addSelectedTag,
    removeSelectedTag,
    clearSelectedTags
  } = useStickers();
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      // Find tags that match the search term
      const matchedTags = allTags
        .filter(tag => tag.toLowerCase().includes(value.toLowerCase()))
        .filter(tag => !selectedTags.includes(tag)) // Don't suggest already selected tags
        .slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(matchedTags);
      setShowSuggestions(matchedTags.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (tag: string) => {
    addSelectedTag(tag);
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  
  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
        <div className="pl-3 text-gray-400">
          <Search size={20} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          placeholder="Search medical stickers by tags..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          className="w-full py-2 px-2 outline-none text-gray-700"
        />
      </div>
      
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map(tag => (
            <span 
              key={tag} 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-medical-100 text-medical-800"
            >
              {tag}
              <button 
                type="button"
                onClick={() => removeSelectedTag(tag)}
                className="ml-1 inline-flex items-center justify-center rounded-full h-4 w-4 text-medical-400 hover:bg-medical-200 hover:text-medical-500"
              >
                ×
              </button>
            </span>
          ))}
          
          <button 
            onClick={clearSelectedTags}
            className="text-xs text-medical-600 hover:text-medical-800"
          >
            Clear all
          </button>
        </div>
      )}
      
      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-1">
            {suggestions.map((tag, index) => (
              <li 
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                onClick={() => handleSuggestionClick(tag)}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
