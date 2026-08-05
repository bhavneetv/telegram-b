import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { DUMMY_CONTENT } from '../data/dummyContent';

export const SearchBar = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Typewriter Animation: Clean descriptive search phrases
  const cyclingTerms = [
    'high-speed HD movies, 4K videos & wallpack',
    'trending anime, series, music & software',
    'unlimited Terabox cloud storage media'
  ];
  const [termText, setTermText] = useState('');
  const [termIdx, setTermIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTerm = cyclingTerms[termIdx];
    const typingSpeed = isDeleting ? 30 : 60;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTermText(currentTerm.substring(0, termText.length + 1));
        if (termText === currentTerm) {
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        setTermText(currentTerm.substring(0, termText.length - 1));
        if (termText === '') {
          setIsDeleting(false);
          setTermIdx((prev) => (prev + 1) % cyclingTerms.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [termText, isDeleting, termIdx]);

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
        <div className="relative flex items-center w-full glass-panel rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500/50 transition-all bg-[#0F172A]/90 border border-white/10">
          {/* Long Typewriter Placeholder bounded cleanly before Search button */}
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
              className="w-full py-2.5 px-3 bg-transparent text-xs text-white focus:outline-none relative z-10"
            />
            
            {!query && (
              <div className="absolute left-3 pointer-events-none text-xs text-gray-400 flex items-center overflow-hidden max-w-[calc(100%-85px)] pr-2">
                <span className="font-semibold text-gray-300 shrink-0">Search </span>
                <span className="text-cyan-400 font-bold ml-1 truncate">{termText}</span>
                <span className="inline-block w-0.5 h-3.5 bg-cyan-400 ml-0.5 animate-pulse shrink-0" />
              </div>
            )}
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

          {/* Separate Search Icon Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={isSearching}
            className={`m-1 px-3.5 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer shrink-0 ${
              isSearching
                ? 'bg-cyan-600/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90'
            }`}
          >
            {isSearching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Autosuggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-12 mt-1 glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-50 bg-[#0F172A]/95 backdrop-blur-xl divide-y divide-white/5"
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
