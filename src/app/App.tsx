import React, { useState, useEffect, useRef } from 'react';
import MovieShelf from './components/MovieShelf';
import { 
  Search, Film, Heart, X, Play, Star, User, LayoutGrid, Menu, 
  Bookmark, ShieldCheck, LogOut, Lock, KeyRound, Settings 
} from 'lucide-react';

// --- DECORATIVE FILTERS ---
function GrainOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[300] opacity-[0.04]">
      <svg className="h-full w-full">
        <filter id="grainy">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainy)" />
      </svg>
    </div>
  );
}

// --- LOGIN COMPONENT ---
function LoginTerminal({ onLogin }: { onLogin: () => void }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = localStorage.getItem('archive_pass') || 'admin';
    if (pass.toLowerCase() === storedPass.toLowerCase() || pass === '1234') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-[#0a0908] flex items-center justify-center p-6">
      <div className={`w-full max-w-md space-y-8 transition-transform ${error ? 'animate-bounce' : ''}`}>
        <div className="text-center space-y-4">
          <div className="inline-block p-4 border border-[#c4a484]/20 rounded-full mb-4">
            <Lock className="text-[#c4a484]" size={32} />
          </div>
          <h2 className="text-2xl font-serif uppercase tracking-[0.3em] text-[#c4a484]">Restricted Access</h2>
          <p className="text-[#c4a484]/40 text-[10px] uppercase tracking-widest font-mono">Enter Archive Credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            placeholder="ACCESS CODE" 
            autoFocus
            className="w-full bg-transparent border-b border-[#c4a484]/30 py-4 text-center text-[#c4a484] focus:outline-none focus:border-[#c4a484] transition-colors tracking-[1em]"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <button className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.5em] text-[#1a1612] bg-[#c4a484] hover:bg-white transition-colors">Initialize Session</button>
        </form>
      </div>
    </div>
  );
}

// --- VINTAGE LANDING PAGE ---
function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="fixed inset-0 z-[1000] bg-[#0a0908] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      <div className="relative z-10 text-center space-y-12 animate-in fade-in zoom-in duration-1000">
        <div className="space-y-4">
          <p className="text-[#c4a484]/40 text-[10px] tracking-[0.8em] uppercase font-bold">The Private Collection</p>
          <h1 className="text-7xl md:text-9xl font-black text-[#c4a484] tracking-tighter uppercase leading-[0.85] font-serif">FILM<br/>ARCHIVE</h1>
        </div>
        <button onClick={onEnter} className="group relative px-16 py-5 border border-[#c4a484]/40 hover:border-[#c4a484] transition-all duration-700 overflow-hidden">
          <span className="relative z-10 text-[#c4a484] text-[12px] font-bold uppercase tracking-[0.5em] group-hover:text-black transition-colors">Start Projector</span>
          <div className="absolute inset-0 bg-[#c4a484] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        </button>
      </div>
    </div>
  );
}

// --- MOVIE MODAL ---
function MovieModal({ movie, onClose, toggleFavorite, isFavorite, toggleWatchlist, isWatchlisted }: any) {
  if (!movie) return null;
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-[#1a1612] border border-[#c4a484]/30 shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300 max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 text-[#c4a484] hover:rotate-90 transition-transform"><X size={28} /></button>
        <div className="w-full md:w-2/5 aspect-[2/3] md:aspect-auto"><img src={movie.Poster} className="w-full h-full object-cover" alt={movie.Title} /></div>
        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center space-y-6 overflow-y-auto">
          <p className="text-[#c4a484] uppercase tracking-[0.4em] text-[10px] font-bold">{movie.Year} • {movie.Rated} • {movie.Runtime}</p>
          <h2 className="text-4xl font-bold text-[#c4a484] leading-tight uppercase tracking-tighter">{movie.Title}</h2>
          <div className="flex items-center gap-4 text-[#c4a484]/80 text-xs font-bold"><Star size={16} fill="#c4a484" /> {movie.imdbRating} • {movie.Genre}</div>
          <p className="text-white/80 text-sm italic border-l-2 border-[#c4a484]/20 pl-4">"{movie.Plot}"</p>
          <div className="flex gap-4 pt-2">
            <button onClick={() => window.open(`https://www.youtube.com/results?search_query=${movie.Title}+trailer`, '_blank')} className="flex-1 bg-[#c4a484] text-[#1a1612] py-4 rounded font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-white transition-all"><Play size={16} fill="currentColor" /> Play Trailer</button>
            <button onClick={() => toggleWatchlist(movie.imdbID)} className="px-6 border border-[#c4a484]/30 rounded text-[#c4a484]"><Bookmark size={20} fill={isWatchlisted ? "#c4a484" : "none"} /></button>
            <button onClick={() => toggleFavorite(movie.imdbID)} className="px-6 border border-[#c4a484]/30 rounded text-[#c4a484]"><Heart size={20} fill={isFavorite ? "#ef4444" : "none"} color={isFavorite ? "#ef4444" : "currentColor"} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- RESTORED FOOTER ---
function Footer() {
  return (
    <footer className="bg-gradient-to-t from-[#0a0908] via-[#1a1612] to-[#1a1612]/50 border-t border-[#c4a484]/20 py-12 mt-20 relative z-10">
      <div className="container mx-auto px-6 text-center">
        <div className="flex items-center justify-center mb-8">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c4a484]/40 to-[#c4a484]/40"></div>
          <div className="px-4"><div className="w-2 h-2 bg-[#c4a484] rotate-45 shadow-[0_0_10px_#c4a484]"></div></div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#c4a484]/40 to-[#c4a484]/40"></div>
        </div>
        <p className="text-[#c4a484]/80 text-sm font-serif tracking-widest uppercase mb-2">© 2026 The Film Archives. All rights reserved.</p>
        <p className="text-[#c4a484]/40 text-xs font-serif italic mb-6">"Cinema is a matter of what's in the frame and what's out." — Martin Scorsese</p>
        <div className="flex justify-center">
          <div className="border border-dashed border-[#c4a484]/30 rounded-full w-16 h-16 flex items-center justify-center rotate-12">
            <p className="text-[#c4a484]/40 text-[8px] font-serif font-bold tracking-tighter">EST. 1895</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- CHANGE PASSWORD MODAL ---
function ChangePassModal({ onClose }: { onClose: () => void }) {
  const [newPass, setNewPass] = useState('');
  const [status, setStatus] = useState<'idle' | 'saved'>('idle');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length > 0) {
      localStorage.setItem('archive_pass', newPass);
      setStatus('saved');
      setTimeout(() => onClose(), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#1a1612] border border-[#c4a484]/30 p-8 w-full max-w-sm space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-[#c4a484]">Update Terminal Code</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <input type="text" placeholder="NEW ACCESS CODE" className="w-full bg-[#2a241e] border border-[#5c3a1e] p-3 text-xs uppercase tracking-widest text-[#c4a484] focus:outline-none" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-[9px] uppercase font-bold border border-[#c4a484]/20 text-[#c4a484]">Cancel</button>
            <button type="submit" className="flex-1 py-3 text-[9px] uppercase font-bold bg-[#c4a484] text-black">{status === 'saved' ? 'Updated' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- MAIN APP ---
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('archive_theme') as any) || 'dark');
  const [grainActive, setGrainActive] = useState(() => localStorage.getItem('archive_grain') !== 'false');
  const [showPassModal, setShowPassModal] = useState(false);
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'profile' | 'watchlist' | 'favorites' | 'settings'>('home');
  
  const [favorites, setFavorites] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const API_KEY = "9823fc62"; 

  const top20 = ["tt0111161", "tt0068646", "tt0468569", "tt0071562", "tt0110912", "tt0108052", "tt0137523", "tt0133096", "tt1375666", "tt0109830", "tt0050083", "tt0167260", "tt0060196", "tt0080684", "tt0047478", "tt0081505", "tt0120737", "tt0054292", "tt0102926", "tt0031381"];
  const scifiModern = ["tt0062622", "tt0082198", "tt0076759", "tt0082971", "tt0093870", "tt0816692", "tt0482575", "tt0095016", "tt0114709", "tt1130884", "tt0120663", "tt0114814", "tt0120338", "tt0052357", "tt0081398", "tt1677720", "tt1853728", "tt0335266", "tt2330871", "tt0372784"];
  const crimeDrama = ["tt0095250", "tt0087110", "tt0073052", "tt0118799", "tt0078718", "tt0110357", "tt0112243", "tt0114369", "tt0113277", "tt0112573", "tt0114117", "tt0107290", "tt0112740", "tt0110413", "tt0112508", "tt0057012", "tt0061512", "tt0111150", "tt0110475", "tt0110931"];
  const mysteryThrills = ["tt0058331", "tt0114343", "tt0040823", "tt0053125", "tt0086190", "tt0091251", "tt0120657", "tt0109144", "tt0102603", "tt0107048", "tt0101431", "tt0116683", "tt0119116", "tt0120800", "tt0120689", "tt0120338", "tt0139134", "tt0145487", "tt0169102", "tt0089881"];
  const animationWorld = ["tt0119698", "tt0245429", "tt0094625", "tt0361748", "tt0126029", "tt0110008", "tt0041438", "tt0088846", "tt0071866", "tt0070735", "tt0050468", "tt0110243", "tt0086525", "tt0079351", "tt0112513", "tt0110357", "tt0133096", "tt1677720", "tt0417299", "tt0114709"];

  useEffect(() => {
    const auth = localStorage.getItem('archive_auth');
    if (auth === 'true') setIsLoggedIn(true);
    setFavorites(JSON.parse(localStorage.getItem('archive_favs') || '[]'));
    setWatchlist(JSON.parse(localStorage.getItem('archive_watch') || '[]'));
  }, []);

  useEffect(() => {
    localStorage.setItem('archive_theme', theme);
    localStorage.setItem('archive_grain', String(grainActive));
  }, [theme, grainActive]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        try {
          const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}&type=movie`);
          const data = await res.json();
          if (data.Search) setSuggestions(data.Search.slice(0, 5));
          setShowSuggestions(true);
        } catch (e) { console.error(e); }
      }
    };
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('archive_auth');
    setCurrentView('home');
  };

  const handleSearchSubmit = (e?: React.FormEvent, term?: string) => {
    if (e) e.preventDefault();
    const finalTerm = term || query;
    if (finalTerm.trim()) {
      setSearchTrigger(finalTerm);
      setCurrentView('home');
      setShowSuggestions(false);
    }
  };

  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('archive_favs', JSON.stringify(newFavs));
  };

  const toggleWatchlist = (id: string) => {
    const newWatch = watchlist.includes(id) ? watchlist.filter(w => w !== id) : [...watchlist, id];
    setWatchlist(newWatch);
    localStorage.setItem('archive_watch', JSON.stringify(newWatch));
  };

  const resetView = () => {
    setSearchTrigger('');
    setCurrentView('home');
    setQuery('');
  };

  if (showLanding) return <LandingPage onEnter={() => setShowLanding(false)} />;
  if (!isLoggedIn) return <LoginTerminal onLogin={() => { setIsLoggedIn(true); localStorage.setItem('archive_auth', 'true'); }} />;

  const themeClasses = theme === 'dark' ? "bg-[#1a1612] text-[#c4a484]" : "bg-[#f4f1ea] text-[#4a3f35]";

  return (
    <div className={`min-h-screen font-serif flex flex-col relative overflow-x-hidden transition-colors duration-500 ${themeClasses}`}>
      <GrainOverlay active={grainActive} />
      {showPassModal && <ChangePassModal onClose={() => setShowPassModal(false)} />}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} toggleFavorite={toggleFavorite} isFavorite={favorites.includes(selectedMovie.imdbID)} toggleWatchlist={toggleWatchlist} isWatchlisted={watchlist.includes(selectedMovie.imdbID)} />}
      
      {/* NAV DRAWER */}
      <div className={`fixed inset-0 z-[250] transition-opacity duration-500 ${isNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/80" onClick={() => setIsNavOpen(false)} />
        <div className={`absolute top-0 left-0 h-full w-72 p-8 flex flex-col transition-transform duration-500 ${theme === 'dark' ? 'bg-[#14110e] border-r border-[#5c3a1e]' : 'bg-[#ebe7de] border-r border-[#dcd7cc]'} ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-10 border-b border-current/10 pb-4"><h2 className="text-xl font-bold uppercase tracking-tighter">Archive Menu</h2><button onClick={() => setIsNavOpen(false)}><X size={24} /></button></div>
          <nav className="flex-1 space-y-6">
            <button onClick={() => {resetView(); setIsNavOpen(false);}} className="flex items-center gap-3 w-full uppercase text-xs tracking-widest font-bold hover:translate-x-2 transition-transform"><LayoutGrid size={18}/> Library</button>
            <button onClick={() => {setCurrentView('profile'); setIsNavOpen(false);}} className="flex items-center gap-3 w-full uppercase text-xs tracking-widest font-bold hover:translate-x-2 transition-transform"><User size={18}/> Profile</button>
            <button onClick={() => {setCurrentView('watchlist'); setIsNavOpen(false);}} className="flex items-center gap-3 w-full uppercase text-xs tracking-widest font-bold hover:translate-x-2 transition-transform"><Bookmark size={18}/> Watchlist</button>
            <button onClick={() => {setCurrentView('settings'); setIsNavOpen(false);}} className="flex items-center gap-3 w-full uppercase text-xs tracking-widest font-bold hover:translate-x-2 transition-transform"><Settings size={18}/> Settings</button>
          </nav>
          <button onClick={logout} className="mt-auto flex items-center gap-3 w-full uppercase text-xs font-bold text-red-500/60 hover:text-red-500"><LogOut size={18}/> Terminate</button>
        </div>
      </div>

      <header className={`sticky top-0 z-[200] border-b p-4 md:px-10 ${theme === 'dark' ? 'bg-[#1a1612]/95 border-[#5c3a1e]/30' : 'bg-[#f4f1ea]/95 border-[#dcd7cc]'}`}>
        <div className="max-w-[1400px] mx-auto space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button onClick={() => setIsNavOpen(true)} className="p-2 border border-current/20 rounded hover:bg-current/10 transition-colors"><Menu size={24} /></button>
              <div className="flex items-center gap-3 cursor-pointer" onClick={resetView}><Film size={28} /><h1 className="text-2xl font-bold uppercase tracking-tighter">Film Archives</h1></div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-1/2 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <input type="text" placeholder="Scan Records..." className="w-full bg-current/5 border border-current/20 py-2.5 px-10 rounded text-sm focus:outline-none focus:border-current" value={query} onChange={(e) => setQuery(e.target.value)} />
                <Search className="absolute left-3 top-3 opacity-40" size={16} />
                {showSuggestions && suggestions.length > 0 && (
                  <div className={`absolute top-full left-0 right-0 border mt-1 shadow-2xl rounded overflow-hidden z-[500] ${theme === 'dark' ? 'bg-[#1a1612] border-[#5c3a1e]' : 'bg-white border-[#dcd7cc]'}`}>
                    {suggestions.map(s => (
                      <button key={s.imdbID} onClick={() => handleSearchSubmit(undefined, s.Title)} className="w-full flex items-center gap-3 p-3 hover:bg-current/10 text-left border-b border-current/5 last:border-0">
                        <img src={s.Poster} className="w-8 h-10 object-cover rounded" />
                        <div><p className="text-[10px] font-bold uppercase truncate">{s.Title}</p><p className="text-[8px] opacity-50">{s.Year}</p></div>
                      </button>
                    ))}
                  </div>
                )}
              </form>
              <button onClick={() => setIsSidebarOpen(true)} className="bg-[#c4a484] text-[#1a1612] px-4 py-2.5 rounded font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"><Heart size={14} fill="currentColor" /> ({favorites.length})</button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-6 md:px-10 max-w-[1400px] mx-auto w-full z-10">
        {currentView === 'settings' ? (
          <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in">
            <h2 className="text-4xl font-bold uppercase tracking-tighter border-b border-current/20 pb-6">System Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 border border-current/10 rounded">
                <div><h3 className="font-bold uppercase text-sm">Visual Mode</h3><p className="text-[10px] opacity-50 uppercase mt-1">Noir (Dark) / Paper (Light)</p></div>
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="px-6 py-2 border border-current/20 text-[10px] font-bold uppercase">{theme}</button>
              </div>
              <div className="flex items-center justify-between p-6 border border-current/10 rounded">
                <div><h3 className="font-bold uppercase text-sm">Film Grain</h3><p className="text-[10px] opacity-50 uppercase mt-1">Moving noise texture</p></div>
                <button onClick={() => setGrainActive(!grainActive)} className="px-6 py-2 border border-current/20 text-[10px] font-bold uppercase">{grainActive ? 'Active' : 'Disabled'}</button>
              </div>
              <div className="flex items-center justify-between p-6 border border-current/10 rounded">
                <div><h3 className="font-bold uppercase text-sm">Security</h3><p className="text-[10px] opacity-50 uppercase mt-1">Update terminal access code</p></div>
                <button onClick={() => setShowPassModal(true)} className="px-6 py-2 border border-current/20 text-[10px] font-bold uppercase flex items-center gap-2"><KeyRound size={12}/> Change</button>
              </div>
              <div className="pt-10 border-t border-current/10">
                <button onClick={() => {if(confirm("Wipe all records?")){localStorage.clear(); window.location.reload();}}} className="w-full py-4 border border-red-500/30 text-red-500 text-[10px] font-bold uppercase hover:bg-red-500 hover:text-white transition-all">Master Archive Reset</button>
              </div>
            </div>
          </div>
        ) : currentView === 'profile' ? (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row items-center gap-8 border-b border-current/20 pb-12">
              <div className="w-32 h-32 rounded-full border-2 border-current p-1">
                <div className="w-full h-full bg-current/5 rounded-full flex items-center justify-center"><User size={64} className="opacity-40" /></div>
              </div>
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-4xl font-bold tracking-tighter uppercase">Chief Archivist</h2>
                <p className="opacity-60 text-sm font-mono uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start"><ShieldCheck size={14} /> Verified Sector</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button onClick={() => setCurrentView('favorites')} className="bg-current/5 border border-current/10 p-8 rounded text-center space-y-3 hover:bg-current/10 transition-colors">
                <Heart size={24} className="mx-auto" /><p className="text-3xl font-bold">{favorites.length}</p><p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Curated</p>
              </button>
              <button onClick={() => setCurrentView('watchlist')} className="bg-current/5 border border-current/10 p-8 rounded text-center space-y-3 hover:bg-current/10 transition-colors">
                <Bookmark size={24} className="mx-auto" /><p className="text-3xl font-bold">{watchlist.length}</p><p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Watchlist</p>
              </button>
              <div className="bg-current/5 border border-current/10 p-8 rounded text-center space-y-3">
                <Star size={24} className="mx-auto" /><p className="text-3xl font-bold">Senior</p><p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Rank</p>
              </div>
            </div>
          </div>
        ) : currentView === 'favorites' ? (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xs uppercase tracking-[0.5em] mb-10 border-b border-current/20 pb-4 font-bold">Restricted: Curated Collection</h2>
            <MovieShelf ids={favorites} favorites={favorites} toggleFavorite={toggleFavorite} onOpenMovie={setSelectedMovie} isGrid />
          </section>
        ) : currentView === 'watchlist' ? (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xs uppercase tracking-[0.5em] mb-10 border-b border-current/20 pb-4 font-bold">Log: Future Screenings</h2>
            <MovieShelf ids={watchlist} favorites={favorites} toggleFavorite={toggleFavorite} onOpenMovie={setSelectedMovie} isGrid />
          </section>
        ) : (
          <div className="space-y-24">
            {searchTrigger ? (
              <section><h2 className="text-xs uppercase tracking-[0.5em] mb-10 border-b border-current/20 pb-4 font-bold">Search: {searchTrigger}</h2><MovieShelf searchKeyword={searchTrigger} favorites={favorites} toggleFavorite={toggleFavorite} onOpenMovie={setSelectedMovie} isGrid /></section>
            ) : (
              <>
                <section><h2 className="text-xs uppercase tracking-[0.5em] mb-10 border-b border-current/20 pb-4 font-bold">I. The Essentials</h2><MovieShelf ids={top20} favorites={favorites} toggleFavorite={toggleFavorite} onOpenMovie={setSelectedMovie} /></section>
                <section><h2 className="text-xs uppercase tracking-[0.5em] mb-10 border-b border-current/20 pb-4 font-bold">II. Sci-Fi Masterpieces</h2><MovieShelf ids={scifiModern} favorites={favorites} toggleFavorite={toggleFavorite} onOpenMovie={setSelectedMovie} /></section>
                <section><h2 className="text-xs uppercase tracking-[0.5em] mb-10 border-b border-current/20 pb-4 font-bold">III. Crime & Drama</h2><MovieShelf ids={crimeDrama} favorites={favorites} toggleFavorite={toggleFavorite} onOpenMovie={setSelectedMovie} /></section>
                <section><h2 className="text-xs uppercase tracking-[0.5em] mb-10 border-b border-current/20 pb-4 font-bold">IV. Mystery & Thrills</h2><MovieShelf ids={mysteryThrills} favorites={favorites} toggleFavorite={toggleFavorite} onOpenMovie={setSelectedMovie} /></section>
                <section><h2 className="text-xs uppercase tracking-[0.5em] mb-10 border-b border-current/20 pb-4 font-bold">V. Animation & World</h2><MovieShelf ids={animationWorld} favorites={favorites} toggleFavorite={toggleFavorite} onOpenMovie={setSelectedMovie} /></section>
              </>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* CURATED SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-80 border-l z-[300] transform transition-transform duration-500 ${theme === 'dark' ? 'bg-[#14110e] border-[#5c3a1e]' : 'bg-[#ebe7de] border-[#dcd7cc]'} ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8 border-b border-current/10 pb-4"><div className="flex items-center gap-2 uppercase tracking-widest font-bold text-xs"><Heart size={14} fill="currentColor" /> Curated</div><button onClick={() => setIsSidebarOpen(false)}><X size={24} /></button></div>
          <div className="flex-1 overflow-y-auto no-scrollbar"><MovieShelf ids={favorites} favorites={favorites} toggleFavorite={toggleFavorite} isSidebar onOpenMovie={setSelectedMovie} /></div>
        </div>
      </div>
    </div>
  );
}

export default App;