import { useState, useEffect, useRef } from 'react';
import { Search, ShieldCheck, Clapperboard, History, Timer } from 'lucide-react';

const Navbar = ({ searchTerm, setSearchTerm }) => {
    const [userInitial, setUserInitial] = useState("?");
    const [isScrolled, setIsScrolled] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [searchHistory, setSearchHistory] = useState([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    
    const [sessionTime, setSessionTime] = useState("00:00");
    const startTimeRef = useRef(Date.now());

    const historyRef = useRef(null);
    const inputRef = useRef(null);
    const lastScrollY = useRef(0);
    const hideTimeoutRef = useRef(null);
    const isHoveredRef = useRef(false);

    const [isVisible, setIsVisible] = useState(true);

    
    const handleMouseEnter = () => {
        isHoveredRef.current = true;
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };

    const handleMouseLeave = () => {
        isHoveredRef.current = false;
        
        if (window.scrollY > 50) {
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = setTimeout(() => {
                if (window.scrollY > 50 && !isHoveredRef.current) {
                    setIsVisible(false);
                }
            }, 2500); 
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('username') || "Aditya";
        setUserInitial(storedUser.charAt(0).toUpperCase());

        const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        setSearchHistory(savedHistory);

        
        const timerInterval = setInterval(() => {
            const secondsElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
            const secs = (secondsElapsed % 60).toString().padStart(2, '0');
            setSessionTime(`${mins}:${secs}`);
        }, 1000);

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            
            if (currentScrollY < 50) {
                
                setIsVisible(true);
                if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            } else if (currentScrollY > lastScrollY.current) {
                
                setIsVisible(false);
                if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            } else {
                
                setIsVisible(true);

                
                if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
                hideTimeoutRef.current = setTimeout(() => {
                    if (window.scrollY > 50 && !isHoveredRef.current) {
                        setIsVisible(false);
                    }
                }, 2500);
            }

            setIsScrolled(currentScrollY > 20);
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);

        const handleClickOutside = (e) => {
            if (historyRef.current && !historyRef.current.contains(e.target)) {
                setIsHistoryOpen(false);
            }
        };
        window.addEventListener('mousedown', handleClickOutside);

        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsHistoryOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            clearInterval(timerInterval); 
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const saveSearchTerm = (term) => {
        if (!term.trim()) return;
        const updatedHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 5);
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    };

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const clearHistory = (e) => {
        e.stopPropagation();
        setSearchHistory([]);
        localStorage.removeItem('searchHistory');
    };

    return (
        <div
            className={`sticky top-0 z-[100] w-full transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
                } ${isScrolled
                    ? 'bg-base-200/90 py-3 border-b border-base-content/10 shadow-lg'
                    : 'bg-transparent py-4 border-b border-base-content/5'
                }`}>


            <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 md:px-16 flex flex-col md:grid md:grid-cols-3 items-center gap-4 md:gap-0">

                <div className="flex items-center gap-4 group cursor-pointer justify-self-center md:justify-self-start">
                    <div className="relative">
                        <div className="relative bg-primary p-2 rounded-xl">
                            <Clapperboard className="text-primary-content w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold tracking-tight text-base-content uppercase leading-none">
                            Watch<span className="text-primary">List</span>
                        </h1>
                    </div>
                </div>

                <div className="justify-self-center relative w-full flex justify-center" ref={historyRef}>
                    <div className="relative group hidden xl:block">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 h-4 w-4 text-base-content/40" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search movies..."
                                className="input input-bordered w-full sm:w-[300px] md:w-[400px] pl-12 h-11 rounded-lg text-sm focus:outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsHistoryOpen(true)}
                                onKeyDown={(e) => e.key === 'Enter' && saveSearchTerm(searchTerm)}
                            />
                        </div>
                    </div>

                    {isHistoryOpen && searchHistory.length > 0 && (
                        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-base-200 border border-base-content/10 rounded-xl p-3 shadow-xl z-[110]">
                            <div className="flex items-center justify-between mb-3 px-2">
                                <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest flex items-center gap-2">
                                    <History size={12} /> Recent
                                </span>
                                <button
                                    onClick={clearHistory}
                                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="space-y-1">
                                {searchHistory.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => { setSearchTerm(item); setIsHistoryOpen(false); }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer group/item transition-all"
                                    >
                                        <Search size={12} className="text-white/10 group-hover/item:text-brand-accent transition-colors" />
                                        <span className="text-[11px] font-bold text-white/60 group-hover/item:text-white transition-colors">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end justify-self-end w-full md:w-auto">
                </div>
            </div>
        </div>
    );
};

export default Navbar;
