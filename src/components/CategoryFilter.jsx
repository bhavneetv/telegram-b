import React from 'react';
import { motion } from 'framer-motion';
import { DUMMY_CATEGORIES } from '../data/dummyContent';
import { triggerHaptic } from '../utils/telegram';

export const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 touch-pan-x select-none pointer-events-auto">
      <div className="flex items-center gap-2.5 min-w-max px-1">
        {DUMMY_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              onClick={() => {
                triggerHaptic('light');
                onSelectCategory(category);
              }}
              className="relative px-4 py-2 rounded-full text-xs font-semibold transition-colors focus:outline-none cursor-pointer shrink-0"
            >
              {isSelected && (
                <motion.div
                  layoutId="categoryHighlight"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-md shadow-cyan-500/30"
                />
              )}

              <span
                className={`relative z-10 ${
                  isSelected ? 'text-white font-bold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {category}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
