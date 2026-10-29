import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { DUMMY_CONTENT } from '../data/dummyContent';

const SEARCH_HINTS = [
  "Search 4K movies & series...",
  "Paste Terabox links here...",
  "Search high-speed media...",
  "Search trending anime & clips...",
  "Search documents, movies & more..."
];

export const SearchBar = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Typewriter animation state for search placeholder
  const [placeholderText, setPlaceholderText] = useState('');
  const [hintIndex, setHintIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (query) return;

    const currentHint = SEARCH_HINTS[hintIndex];
    let timeout;

    if (!isDeleting) {
      if (placeholderText.length < currentHint.length) {
        timeout = setTimeout(() => {
          setPlaceholderText(currentHint.slice(0, placeholderText.length + 1));
        }, 70);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (placeholderText.length > 0) {
        timeout = setTimeout(() => {
          setPlaceholderText(currentHint.slice(0, placeholderText.length - 1));
        }, 35);
      } else {
        setIsDeleting(false);
        setHintIndex((prev) => (prev + 1) % SEARCH_HINTS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, hintIndex, query]);

  // Filter autosuggestions
  useEffect(() => {
    if (query.trim().length >= 2) {
      const q = query.toLowerCase();
      const matches = DUMMY_CONTENT.filter(
        (item) => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
      ).slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecuteSearch = (searchVal) => {
    const val = searchVal !== undefined ? searchVal : query;
    setShowSuggestions(false);
    onSearch(val);
  };

  const handleClearInput = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full z-30 flex">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleExecuteSearch();
        }}
        className="relative flex-1 flex items-center"
      >
        <div className="relative flex items-center w-full glass-search rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-400/60 transition-all duration-300">
          {/* Subtle Chamfer Top Highlight in Blue */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/35 to-transparent pointer-events-none" />

          {/* Left-side Grey Search Icon inside input */}
          <Search className="w-4 h-4 text-gray-400 ml-3.5 shrink-0 pointer-events-none" />

          {/* Clean Input with Animated Typewriter Placeholder */}
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
              placeholder={placeholderText || "Search movies, series & 4K files..."}
              className="w-full py-2.5 px-3 bg-transparent text-xs text-white placeholder:text-gray-400 focus:outline-none relative z-10 font-medium"
            />
          </div>

          {query && (
            <button
              type="button"
              onClick={handleClearInput}
              className="p-1.5 mr-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search Button (Electric Blue Gradient with Pure White Text) */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={isSearching}
            className={`m-1 px-4 py-2 rounded-xl text-xs font-black text-white flex items-center justify-center transition-all shadow-lg cursor-pointer shrink-0 ${
              isSearching
                ? 'bg-blue-600/50 text-white/70 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/30 hover:shadow-blue-500/50 hover:brightness-110'
            }`}
          >
            {isSearching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <span>Search</span>
            )}
          </motion.button>
        </div>
      </form>

      {/* Autosuggestions Dropdown with Frosted Glass */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-12 mt-1.5 glass-frosted rounded-2xl overflow-hidden shadow-2xl z-50 divide-y divide-white/10"
          >
            {suggestions.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setQuery(item.title);
                  handleExecuteSearch(item.title);
                }}
                className="w-full flex items-center justify-between p-2.5 text-left hover:bg-white/5 transition-colors text-xs text-gray-200 cursor-pointer"
              >
                <span className="font-medium truncate mr-2">{item.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[9px] uppercase font-bold shrink-0">
                  {item.category}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
