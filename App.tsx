import React, { useState, useCallback, useEffect, useRef } from 'react';
import { QuoteCard } from './components/QuoteCard';
import { fetchQuoteBatch } from './services/geminiService';
import { getRandomStaticQuote } from './services/staticQuotes';
import { QuoteData } from './types';

const App: React.FC = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  
  // Quote Buffer System
  const quoteBuffer = useRef<QuoteData[]>([]);
  const isFetchingRef = useRef<boolean>(false);

  // Function to replenish buffer in background
  const replenishBuffer = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    // Only fetch if buffer is getting low (< 3 items)
    if (quoteBuffer.current.length >= 5) return;

    isFetchingRef.current = true;
    try {
      const newQuotes = await fetchQuoteBatch();
      if (newQuotes && newQuotes.length > 0) {
        // Add unique quotes to buffer (simple dedup check)
        const currentContent = new Set(quoteBuffer.current.map(q => q.content));
        const uniqueNew = newQuotes.filter(q => !currentContent.has(q.content));
        quoteBuffer.current = [...quoteBuffer.current, ...uniqueNew];
        console.log(`Buffer replenished. Count: ${quoteBuffer.current.length}`);
      }
    } catch (e) {
      console.error("Background fetch failed", e);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // Initial load: fill buffer
  useEffect(() => {
    replenishBuffer();
  }, [replenishBuffer]);

  const handleGenerateQuote = useCallback(async () => {
    setLoading(true);
    setHasStarted(true);

    // Artificial delay for "Book of Answers" feel (shuffling/thinking)
    await new Promise(resolve => setTimeout(resolve, 800));

    let nextQuote: QuoteData;

    if (quoteBuffer.current.length > 0) {
      nextQuote = quoteBuffer.current.shift()!; 
    } else {
      nextQuote = getRandomStaticQuote();
    }
    
    setQuote(nextQuote);
    setLoading(false);

    if (quoteBuffer.current.length < 3) {
        replenishBuffer();
    }
  }, [replenishBuffer]);

  return (
    <div className="min-h-screen bg-paper-cream flex flex-col items-center py-12 px-4 font-sans relative overflow-x-hidden selection:bg-mao-red/20">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] bg-mao-red/[0.03] rounded-full blur-3xl"></div>
          <div className="absolute top-[20%] -left-[10%] w-[40vw] h-[40vw] bg-mao-gold/[0.04] rounded-full blur-3xl"></div>
      </div>

      <header className="mb-10 text-center z-10 relative">
        <div className="inline-flex items-center justify-center space-x-3 mb-4 opacity-80">
            <span className="h-px w-6 bg-mao-red"></span>
            <span className="text-mao-red font-bold tracking-[0.3em] text-[10px] uppercase">Red Inspiration</span>
            <span className="h-px w-6 bg-mao-red"></span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-3 tracking-wide">
          红色指引
        </h1>
        <p className="text-stone-500 text-sm md:text-base font-serif italic opacity-75">
          Answers from the Selected Works of Mao Zedong
        </p>
      </header>

      <main className="w-full flex-grow flex flex-col items-center z-10">
        <div className="w-full max-w-md">
            {!hasStarted ? (
                <div className="flex flex-col items-center justify-center animate-fade-in p-8 border border-dashed border-stone-300 rounded-sm bg-white/40 backdrop-blur-sm w-full aspect-[3/4.5] min-h-[520px]">
                    <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-10 text-stone-300 shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <p className="text-center text-stone-600 font-serif mb-4 text-xl tracking-[0.2em] font-medium">心之所惑，请教毛选</p>
                    <p className="text-center text-stone-400 font-serif text-sm px-6 leading-8 tracking-widest opacity-80">
                        于字里行间<br/>寻破局之智与奋斗之光
                    </p>
                </div>
            ) : (
                <QuoteCard quote={quote || {content: '', source: '', explanation: ''}} isLoading={loading} />
            )}
        </div>

        <div className="mt-12 mb-8 flex flex-col items-center space-y-4">
          <button
            onClick={handleGenerateQuote}
            disabled={loading}
            className={`
                group relative inline-flex items-center justify-center px-12 py-4 text-lg text-white transition-all duration-300 
                bg-mao-red font-serif tracking-[0.2em] rounded-full shadow-lg shadow-red-900/20 overflow-hidden w-64
                ${loading ? 'cursor-default opacity-90' : 'hover:bg-[#b00e28] hover:shadow-xl hover:shadow-red-900/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'}
            `}
          >
            {loading ? (
                <div className="flex items-center space-x-1.5 py-1">
                   <div className="w-1.5 h-1.5 bg-white/90 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                   <div className="w-1.5 h-1.5 bg-white/90 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                   <div className="w-1.5 h-1.5 bg-white/90 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                </div>
            ) : (
                <span className="relative z-10 font-bold">{hasStarted ? '下一条指引' : '翻开指引'}</span>
            )}
            
            {/* Button Shine Effect */}
            {!loading && (
                <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                </div>
            )}
          </button>
        </div>
      </main>

      <footer className="text-center text-[10px] text-stone-400 font-sans pb-6 z-10 tracking-wider uppercase opacity-60">
        <p>© {new Date().getFullYear()} Red Inspiration Generator</p>
        <p className="mt-1">内容由AI辅助生成</p>
      </footer>
    </div>
  );
};

export default App;