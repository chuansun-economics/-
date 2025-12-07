import React from 'react';
import { QuoteData } from '../types';

interface QuoteCardProps {
  quote: QuoteData;
  isLoading: boolean;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, isLoading }) => {
  // Determine if text is very long to adjust font size gracefully
  const isLongText = quote.content.length > 40;
  
  // Stable container class that doesn't change based on loading state
  const containerClass = "w-full max-w-md mx-auto bg-white rounded-sm shadow-2xl overflow-hidden relative border border-stone-50 flex flex-col aspect-[3/4.5] min-h-[520px] transition-shadow duration-500 hover:shadow-3xl";

  return (
    <div className={containerClass}>
      {/* Decorative Top Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-mao-red/80 via-mao-red to-mao-red/80 absolute top-0 left-0 z-30"></div>
      
      {/* Background Textures - Constant and Stable */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] z-0"></div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-stone-50/50 via-transparent to-transparent z-0"></div>

      {/* Content Switching Area */}
      <div className="relative z-10 flex-grow flex flex-col h-full">
        {isLoading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center p-8 animate-fade-in bg-white/90 backdrop-blur-[1px] z-20">
                <div className="text-mao-red/80 text-4xl mb-6 animate-[spin_3s_linear_infinite]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.4 7.2h7.6l-6 4.8l2.4 7.2l-6-4.8l-6 4.8l2.4-7.2l-6-4.8h7.6z"/></svg>
                </div>
                <p className="text-stone-400 font-serif text-sm tracking-widest animate-pulse">正在翻阅选集...</p>
             </div>
        ) : (
            <div key={quote.content} className="flex flex-col h-full p-8 md:p-12 animate-fade-in">
                
                {/* Quote Symbol Top */}
                <div className="absolute top-10 left-8 text-8xl text-stone-100/60 font-serif leading-none select-none font-black">“</div>

                {/* Main Text */}
                <div className="flex-grow flex flex-col items-center justify-center py-6 my-2 relative">
                  <h1 className={`
                    font-serif font-bold text-gray-800 text-center 
                    ${isLongText ? 'text-xl md:text-2xl leading-loose tracking-wide' : 'text-2xl md:text-3xl leading-relaxed tracking-widest'}
                  `}>
                    {quote.content}
                  </h1>
                </div>

                {/* Quote Symbol Bottom */}
                <div className="absolute bottom-40 right-8 text-8xl text-stone-100/60 font-serif leading-none select-none font-black rotate-180">“</div>

                {/* Footer */}
                <div className="mt-auto pt-8">
                  <div className="flex flex-col items-end space-y-1.5 mb-8">
                     <div className="flex items-center space-x-2">
                        <span className="h-px w-8 bg-stone-400"></span>
                        <span className="text-stone-800 font-bold text-base tracking-[0.2em]">毛泽东</span>
                     </div>
                     <div className="text-stone-400 text-xs font-serif tracking-wider text-right flex flex-col items-end">
                        <span className="mb-0.5">《{quote.source}》</span>
                        {quote.year && <span className="