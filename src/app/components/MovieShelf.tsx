import React, { useEffect, useState } from 'react';
import { Heart, Loader2, Star } from 'lucide-react';

interface Props {
  searchKeyword?: string;
  ids?: string[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isSidebar?: boolean;
  isGrid?: boolean;
  onOpenMovie: (movie: any) => void;
}

export default function MovieShelf({ searchKeyword, ids, favorites, toggleFavorite, isSidebar, isGrid, onOpenMovie }: Props) {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const API_KEY = "9823fc62"; 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let movieData: any[] = [];
        if (ids && ids.length > 0) {
          const detailPromises = ids.map(id => fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`).then(r => r.json()));
          movieData = await Promise.all(detailPromises);
        } else if (searchKeyword) {
          const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchKeyword)}&apikey=${API_KEY}&type=movie`);
          const data = await res.json();
          if (data.Search) {
             const detailPromises = data.Search.slice(0, 15).map((m: any) => fetch(`https://www.omdbapi.com/?i=${m.imdbID}&apikey=${API_KEY}`).then(r => r.json()));
             movieData = await Promise.all(detailPromises);
          }
        }
        setMovies(movieData.filter(m => m && m.Response === "True" && m.Poster !== 'N/A'));
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, [searchKeyword, JSON.stringify(ids)]);

  if (loading) return <div className="flex items-center justify-center py-20 w-full animate-pulse"><Loader2 className="animate-spin mr-2" /><span className="text-[10px] uppercase tracking-[0.3em]">Accessing Vault...</span></div>;
  if (movies.length === 0) return <div className="py-10 text-center w-full opacity-40"><p className="text-[10px] uppercase tracking-[0.3em]">No records found</p></div>;

  const containerClass = isGrid ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8" : isSidebar ? "flex flex-col gap-6" : "flex gap-6 overflow-x-auto no-scrollbar pb-6";

  return (
    <div className={containerClass}>
      {movies.map((movie) => (
        <div key={movie.imdbID} onClick={() => onOpenMovie(movie)} className={`relative transition-all hover:scale-105 cursor-pointer group flex-none ${isSidebar || isGrid ? 'w-full' : 'w-[180px] md:w-[210px]'}`}>
          <div className="aspect-[2/3] overflow-hidden border border-current/20 bg-black/10 relative shadow-xl">
            <img src={movie.Poster} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={movie.Title} />
            <button onClick={(e) => { e.stopPropagation(); toggleFavorite(movie.imdbID); }} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full border border-white/10 z-10 hover:bg-[#ef4444]/20 transition-colors">
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
  );
}