import React, { forwardRef, useMemo } from 'react';
import { QuoteData } from '../types';

interface QuoteCardProps {
  quote: QuoteData;
  isLoading: boolean;
}

export const QuoteCard = forwardRef<HTMLDivElement, QuoteCardProps>(({ quote, isLoading }, ref) => {
  // Determine if text is very long to adjust font size gracefully
  const isLongText = quote.content.length > 40;
  
  // Format current date for the card
  const todayDate = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return `${year}年${month}月${day}日`;
  }, []);

  // Stable container class 
  // Changed bg-white to bg-[#fffcf7] for a warm paper look that captures perfectly in screenshots
  const containerClass = "w-full max-w-md mx-auto bg-[#fffcf7] rounded-sm shadow-2xl overflow-hidden relative border border-stone-100 flex flex-col aspect-[3/4.5] min-h-[520px] transition-shadow duration-500 hover:shadow-3xl";

  return (
    <div ref={ref} className={containerClass}>
      {/* Decorative Top Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-mao-red/90 via-mao-red to-mao-red/90 absolute top-0 left-0 z-30"></div>
      
      {/* Background Textures - Replaced external image with CSS gradient for reliable screenshots */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white via-transparent to-stone-100/30 z-0"></div>

      {/* Content Switching Area */}
      <div className="relative z-10 flex-grow flex flex-col h-full">
        {isLoading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center p-8 animate-gentle-fade bg-[#fffcf7]/90 backdrop-blur-[1px] z-20">
                <div className="text-mao-red/80 text-4xl mb-6 animate-[spin_3s_linear_infinite]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.4 7.2h7.6l-6 4.8l2.4 7.2l-6-4.8l-6 4.8l2.4-7.2l-6-4.8h7.6z"/></svg>
                </div>
                <p className="text-stone-500 font-serif text-sm tracking-widest animate-pulse">正在翻阅选集...</p>
             </div>
        ) : (
            <div key={quote.content} className="flex flex-col h-full p-8 md:p-12 animate-gentle-fade">
                
                {/* Main Text Area - Centered vertically and horizontally */}
                <div className="flex-grow flex flex-col items-center justify-center relative w-full my-4">
                  <div className="relative px-2">
                      {/* Quote Symbol Top - Increased spacing from -top-8 to -top-12 */}
                      <div className="absolute -top-12 -left-6 md:-left-8 text-8xl text-stone-200 font-serif leading-none select-none font-black opacity-60">“</div>

                      {/* Text Content */}
                      <h1 className={`
                        font-serif font-bold text-gray-900 text-center z-10 relative px-2
                        ${isLongText ? 'text-xl md:text-2xl leading-loose tracking-wide' : 'text-2xl md:text-3xl leading-relaxed tracking-widest'}
                      `}>
                        {quote.content}
                      </h1>

                      {/* Quote Symbol Bottom */}
                      <div className="absolute -bottom-10 -right-4 md:-right-6 text-8xl text-stone-200 font-serif leading-none select-none font-black rotate-180 opacity-60">“</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 relative z-20">
                  <div className="flex flex-col items-end space-y-2 mb-6">
                     <div className="flex items-center space-x-2">
                        <span className="h-px w-8 bg-stone-400"></span>
                        <span className="text-gray-900 font-bold text-base tracking-[0.2em]">毛泽东</span>
                     </div>
                     <div className="text-stone-500 text-xs font-serif tracking-wider text-right flex flex-col items-end font-medium">
                        <span className="mb-1">《{quote.source}》</span>
                        {quote.year && <span className="text-stone-400 text-[10px]">{quote.year}</span>}
                     </div>
                  </div>
                  
                  {/* Enhanced Separator Line */}
                  <div className="relative pt-6 border-t-2 border-mao-red/20">
                     <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#fffcf7] px-3 text-mao-red/40">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2h7.6l-6 4.8l2.4 7.2l-6-4.8l-6 4.8l2.4-7.2l-6-4.8h7.6z"/></svg>
                     </div>
                     <p className="text-xs text-mao-red/60 text-center uppercase tracking-[0.3em] mb-3 font-sans font-bold">指引解析</p>
                     
                     {/* Explanation Text */}
                     <p className="text-sm text-gray-900 font-serif leading-8 text-justify tracking-wide px-1 mb-4 font-medium opacity-90">
                      {quote.explanation}
                    </p>
                    
                    {/* Date Stamp */}
                    <div className="w-full flex justify-end border-t border-dashed border-stone-200 pt-3">
                      <span className="text-[11px] text-stone-500 font-serif tracking-widest font-medium">{todayDate}</span>
                    </div>
                  </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
});

QuoteCard.displayName = "QuoteCard";