import React, { useEffect, useState, useMemo } from 'react';
import { Heart, Loader2, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  searchKeyword?: string;
  ids?: string[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isSidebar?: boolean;
  isGrid?: boolean;
  onOpenMovie: (movie: any) => void;
  sortBy?: 'year' | 'rating' | 'default';
}

export default function MovieShelf({ searchKeyword, ids, favorites, toggleFavorite, isSidebar, isGrid, onOpenMovie, sortBy = 'default' }: Props) {
  const { t } = useTranslation();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // SECURE API KEY REFERENCE
  const API_KEY = (import.meta as any).env.VITE_OMDB_API_KEY;

  // Reset page to 1 whenever a new search is initiated
  useEffect(() => {
    setPage(1);
  }, [searchKeyword]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let movieData: any[] = [];
        
        // CASE A: Static ID Collections (Essentials, Sci-Fi, etc.)
        if (ids && ids.length > 0) {
          const detailPromises = ids.map(id => 
            fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`).then(r => r.json())
          );
          movieData = await Promise.all(detailPromises);
          setTotalResults(movieData.length);
        } 
        // CASE B: Paginated Search Results
        else if (searchKeyword) {
          const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchKeyword)}&apikey=${API_KEY}&type=movie&page=${page}`);
          const data = await res.json();
          if (data.Search) {
            setTotalResults(parseInt(data.totalResults));
            const detailPromises = data.Search.map((m: any) => 
              fetch(`https://www.omdbapi.com/?i=${m.imdbID}&apikey=${API_KEY}`).then(r => r.json())
            );
            movieData = await Promise.all(detailPromises);
          }
        }
        
        setMovies(movieData.filter(m => m && m.Response === "True" && m.Poster !== 'N/A'));
      } catch (err) { 
        console.error("Archive Access Denied:", err); 
      }
      setLoading(false);
    };

    fetchData();
  }, [searchKeyword, JSON.stringify(ids), page, API_KEY]);

  // --- SORTING LOGIC ---
  const sortedMovies = useMemo(() => {
    const list = [...movies];
    if (sortBy === 'year') {
      return list.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
    }
    return list;
  }, [movies, sortBy]);

  if (loading) return (
    <div className="flex items-center justify-center py-20 w-full animate-pulse">
      <Loader2 className="animate-spin mr-2" />
      <span className="text-[10px] uppercase tracking-[0.3em]">{t('scanning')}</span>
    </div>
  );

  if (movies.length === 0) return (
    <div className="py-10 text-center w-full opacity-40">
      <p className="text-[10px] uppercase tracking-[0.3em]">{t('no_records')}</p>
    </div>
  );

  const containerClass = isGrid 
    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8" 
    : isSidebar 
      ? "flex flex-col gap-6" 
      : "flex gap-6 overflow-x-auto no-scrollbar pb-6";

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="space-y-8">
      <div className={containerClass}>
        {sortedMovies.map((movie) => (
          <div 
            key={movie.imdbID} 
            onClick={() => onOpenMovie(movie)} 
            className={`relative transition-all hover:scale-105 cursor-pointer group flex-none ${isSidebar || isGrid ? 'w-full' : 'w-[180px] md:w-[210px]'}`}
          >
            <div className="aspect-[2/3] overflow-hidden border border-current/20 bg-black/10 relative shadow-xl">
              <img 
                src={movie.Poster} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                alt={movie.Title} 
              />
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite(movie.imdbID); }} 
                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full border border-white/10 z-10 hover:bg-[#ef4444]/20 transition-colors"
              >
                <Heart size={14} fill={favorites.includes(movie.imdbID) ? "#ef4444" : "none"} color={favorites.includes(movie.imdbID) ? "#ef4444" : "white"} />
              </button>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black text-[10px] text-[#c4a484] opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1 font-bold"><Star size={10} fill="#c4a484" /> {movie.imdbRating}</div>
                  <div className="opacity-60">{movie.Year}</div>
              </div>
            </div>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-widest truncate opacity-70 group-hover:opacity-100">{movie.Title}</p>
          </div>
        ))}
      </div>

      {/* VINTAGE PAGINATION CONTROLS */}
      {searchKeyword && totalPages > 1 && (
        <div className="flex items-center justify-center gap-8 pt-10 border-t border-current/10">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest disabled:opacity-20 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#c4a484]">
              Sector {page}
            </span>
            <span className="text-[8px] opacity-30 tracking-widest uppercase">
              of {totalPages}
            </span>
          </div>

          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest disabled:opacity-20 hover:text-white transition-colors"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}