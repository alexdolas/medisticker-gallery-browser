
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { StickerContextType, StickerData, ActionType } from '../types';

// Sample data - This would be replaced with real data from CSV
const sampleStickers: StickerData[] = [
  {
    id: '1',
    filename: '6_6.png',
    tags: ['heart', 'organ', 'cardiovascular', 'anatomy'],
    url: '/placeholder.svg',
    category: 'cardiovascular'
  },
  {
    id: '2',
    filename: '14_3.png',
    tags: ['heart', 'organ', 'cardiovascular', 'anatomy', 'medical', 'illustration', 'human', 'heart icon'],
    url: '/placeholder.svg',
    category: 'cardiovascular'
  },
  {
    id: '3',
    filename: '19_8.png',
    tags: ['brain', 'organ', 'neurology', 'anatomy'],
    url: '/placeholder.svg',
    category: 'neurology'
  },
  {
    id: '4',
    filename: '23_1.png',
    tags: ['lungs', 'organ', 'respiratory', 'anatomy'],
    url: '/placeholder.svg',
    category: 'respiratory'
  },
  {
    id: '5',
    filename: '31_5.png',
    tags: ['kidney', 'organ', 'urinary', 'anatomy'],
    url: '/placeholder.svg',
    category: 'urinary'
  },
];

// Initial context state
const initialState: StickerContextType = {
  stickers: [],
  filteredStickers: [],
  searchTerm: '',
  selectedTags: [],
  recentStickers: [],
  allTags: [],
  popularTags: ['heart', 'brain', 'lungs', 'kidney', 'anatomy', 'cardiovascular', 'respiratory'],
  categories: [],
  isLoading: false,
  error: null,
  setSearchTerm: () => {},
  addSelectedTag: () => {},
  removeSelectedTag: () => {},
  clearSelectedTags: () => {},
  trackStickerUsage: () => {},
};

// Create context
const StickersContext = createContext<StickerContextType>(initialState);

// Reducer for state management
const stickersReducer = (state: StickerContextType, action: ActionType): StickerContextType => {
  switch (action.type) {
    case 'SET_STICKERS':
      return {
        ...state,
        stickers: action.payload,
        filteredStickers: action.payload,
        allTags: extractAllUniqueTags(action.payload),
        categories: extractCategories(action.payload),
      };
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload,
        filteredStickers: filterStickers(state.stickers, action.payload, state.selectedTags),
      };
    case 'ADD_SELECTED_TAG':
      if (state.selectedTags.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        selectedTags: [...state.selectedTags, action.payload],
        filteredStickers: filterStickers(state.stickers, state.searchTerm, [...state.selectedTags, action.payload]),
      };
    case 'REMOVE_SELECTED_TAG':
      return {
        ...state,
        selectedTags: state.selectedTags.filter(tag => tag !== action.payload),
        filteredStickers: filterStickers(
          state.stickers, 
          state.searchTerm, 
          state.selectedTags.filter(tag => tag !== action.payload)
        ),
      };
    case 'CLEAR_SELECTED_TAGS':
      return {
        ...state,
        selectedTags: [],
        filteredStickers: filterStickers(state.stickers, state.searchTerm, []),
      };
    case 'TRACK_STICKER_USAGE':
      // Track the sticker in recent usage and local storage
      const updatedRecentStickers = [
        action.payload,
        ...state.recentStickers.filter(s => s.id !== action.payload.id)
      ].slice(0, 12); // Keep only the latest 12 stickers
      
      // Save to local storage
      try {
        localStorage.setItem('recentStickers', JSON.stringify(updatedRecentStickers));
      } catch (error) {
        console.error('Failed to save recent stickers to local storage', error);
      }
      
      return {
        ...state,
        recentStickers: updatedRecentStickers,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Helper functions for the reducer
const extractAllUniqueTags = (stickers: StickerData[]): string[] => {
  const tagSet = new Set<string>();
  stickers.forEach(sticker => {
    sticker.tags.forEach(tag => {
      tagSet.add(tag.trim().toLowerCase());
    });
  });
  return Array.from(tagSet).sort();
};

const extractCategories = (stickers: StickerData[]): string[] => {
  const categorySet = new Set<string>();
  stickers.forEach(sticker => {
    if (sticker.category) {
      categorySet.add(sticker.category);
    }
  });
  return Array.from(categorySet).sort();
};

const filterStickers = (stickers: StickerData[], searchTerm: string, selectedTags: string[]): StickerData[] => {
  let result = stickers;
  
  // Filter by search term
  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    result = result.filter(sticker => 
      sticker.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
    );
  }
  
  // Filter by selected tags
  if (selectedTags.length > 0) {
    result = result.filter(sticker => 
      selectedTags.every(selectedTag => 
        sticker.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      )
    );
  }
  
  return result;
};

// Provider component
export const StickersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(stickersReducer, initialState);
  
  // Load initial data
  useEffect(() => {
    const loadStickerData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // In a real app, we would fetch from a CSV file or API
        // For now, we'll use the sample data
        dispatch({ type: 'SET_STICKERS', payload: sampleStickers });
        
        // Load recent stickers from local storage
        try {
          const savedRecent = localStorage.getItem('recentStickers');
          if (savedRecent) {
            const recentStickers = JSON.parse(savedRecent) as StickerData[];
            // Update state with stored recent stickers
            recentStickers.forEach(sticker => {
              dispatch({ type: 'TRACK_STICKER_USAGE', payload: sticker });
            });
          }
        } catch (error) {
          console.error('Failed to load recent stickers from local storage', error);
        }
        
      } catch (error) {
        console.error('Error loading sticker data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load sticker data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadStickerData();
  }, []);
  
  // Define handler functions for the context
  const setSearchTerm = (term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  };
  
  const addSelectedTag = (tag: string) => {
    dispatch({ type: 'ADD_SELECTED_TAG', payload: tag });
  };
  
  const removeSelectedTag = (tag: string) => {
    dispatch({ type: 'REMOVE_SELECTED_TAG', payload: tag });
  };
  
  const clearSelectedTags = () => {
    dispatch({ type: 'CLEAR_SELECTED_TAGS' });
  };
  
  const trackStickerUsage = (sticker: StickerData) => {
    dispatch({ type: 'TRACK_STICKER_USAGE', payload: sticker });
  };
  
  return (
    <StickersContext.Provider value={{
      ...state,
      setSearchTerm,
      addSelectedTag,
      removeSelectedTag,
      clearSelectedTags,
      trackStickerUsage,
    }}>
      {children}
    </StickersContext.Provider>
  );
};

// Custom hook to use the context
export const useStickers = () => useContext(StickersContext);
