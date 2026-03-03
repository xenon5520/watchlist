import React, { useEffect, useState } from 'react';
import { Plus, ChevronDown, Star, LayoutGrid, SearchX, CheckCircle2, PlayCircle, Clock, Library, Film, X, Tv } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import MovieCard from '../components/MovieCard';
import Navbar from '../components/Navbar';

const AddMovie = ({ fetchMovies }) => {
    const [movie, setMovie] = useState({
        title: '',
        type: 'Movie',
        genre: '',
        rating: '',
        watchStatus: 'Plan to Watch',
        streamingPlatform: '',
        releaseYear: '',
        posterUrl: '',
        isFavorite: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            const movieData = {
                title: movie.title.trim(),
                type: movie.type,
                genre: movie.genre
                    .split(',')
                    .map(g => g.trim())
                    .filter(Boolean),
                rating: movie.rating ? Number(movie.rating) : undefined,
                watchStatus: movie.watchStatus,
                streamingPlatform: movie.streamingPlatform.trim() || undefined,
                releaseYear: movie.releaseYear ? Number(movie.releaseYear) : undefined,
                posterUrl: movie.posterUrl.trim() || undefined,
                isFavorite: movie.isFavorite
            };

            await api.post(
                '/movies',
                movieData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success('Movie added to database!');

            setMovie({
                title: '',
                type: 'Movie',
                genre: '',
                rating: '',
                watchStatus: 'Plan to Watch',
                streamingPlatform: '',
                releaseYear: '',
                posterUrl: '',
                isFavorite: false
            });

            document.getElementById('add_movie_modal').close();
            if (fetchMovies) fetchMovies();
        } catch (err) {
            toast.error(
                err?.response?.data?.message || 'Cloud synchronization failed'
            );
        }
    };

    return (
        <>
            {/* PREMIUM TRIGGER BUTTON */}
            <button
                className="btn btn-primary h-11 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-sm transition-all border-none flex items-center gap-2"
                onClick={() => document.getElementById('add_movie_modal').showModal()}
            >
                <Plus size={16} strokeWidth={3} /> New Entry
            </button>

            <dialog id="add_movie_modal" className="modal">
                <div className="modal-box w-11/12 max-w-xl bg-base-200 border border-base-content/5 rounded-2xl p-8 shadow-2xl">

                    {/* HEADER SECTION */}
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
                            <Film className="text-primary" size={24} />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight text-base-content uppercase leading-none">
                            Add New <span className="text-primary">Movie</span>
                        </h3>
                        <p className="text-[10px] font-bold tracking-widest text-base-content/40 uppercase mt-2">
                            Updating archive database
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Title - Full Width */}
                        <div className="form-control md:col-span-2">
                            <label className="label text-[10px] font-bold text-base-content/40 uppercase tracking-widest ml-1">
                                Title
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Inception"
                                className="input input-bordered bg-base-100 border-base-content/10 h-12 px-5 rounded-xl font-bold text-sm tracking-wide focus:border-primary transition-all text-base-content w-full"
                                value={movie.title}
                                onChange={(e) => setMovie({ ...movie, title: e.target.value })}
                                required
                            />
                        </div>

                        {/* Type */}
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-base-content/40 uppercase tracking-widest ml-1">Media Type</label>
                            <select
                                className="select select-bordered bg-base-100 border-base-content/10 h-12 px-5 rounded-xl font-bold text-sm text-base-content focus:border-primary w-full"
                                value={movie.type}
                                onChange={(e) => setMovie({ ...movie, type: e.target.value })}
                            >
                                <option value="Movie">Movie</option>
                                <option value="Series">Series</option>
                            </select>
                        </div>

                        {/* Rating */}
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-base-content/40 uppercase tracking-widest ml-1">Rating</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                step="0.1"
                                placeholder="1 - 10"
                                className="input input-bordered bg-base-100 border-base-content/10 h-12 px-5 rounded-xl font-bold text-sm text-warning focus:border-primary w-full"
                                value={movie.rating}
                                onChange={(e) => setMovie({ ...movie, rating: e.target.value })}
                            />
                        </div>

                        {/* Genres - Full Width */}
                        <div className="form-control md:col-span-2">
                            <label className="label text-[10px] font-bold text-base-content/40 uppercase tracking-widest ml-1">Genres (Comma separated)</label>
                            <input
                                type="text"
                                placeholder="Action, Sci-Fi, Thriller"
                                className="input input-bordered bg-base-100 border-base-content/10 h-12 px-5 rounded-xl font-bold text-sm tracking-wide focus:border-primary transition-all text-base-content w-full"
                                value={movie.genre}
                                onChange={(e) => setMovie({ ...movie, genre: e.target.value })}
                                required
                            />
                        </div>

                        {/* Status */}
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-base-content/40 uppercase tracking-widest ml-1">Watch Status</label>
                            <select
                                className="select select-bordered bg-base-100 border-base-content/10 h-12 px-5 rounded-xl font-bold text-sm text-base-content focus:border-primary w-full"
                                value={movie.watchStatus}
                                onChange={(e) => setMovie({ ...movie, watchStatus: e.target.value })}
                            >
                                <option value="Plan to Watch">Plan to Watch</option>
                                <option value="Watching">Watching</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        {/* Platform */}
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-base-content/40 uppercase tracking-widest ml-1">Platform</label>
                            <input
                                type="text"
                                placeholder="Netflix / Prime"
                                className="input input-bordered bg-base-100 border-base-content/10 h-12 px-5 rounded-xl font-bold text-sm text-base-content focus:border-primary w-full"
                                value={movie.streamingPlatform}
                                onChange={(e) => setMovie({ ...movie, streamingPlatform: e.target.value })}
                            />
                        </div>

                        {/* Release Year */}
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-base-content/40 uppercase tracking-widest ml-1">Release Year</label>
                            <input
                                type="number"
                                placeholder="e.g. 2024"
                                className="input input-bordered bg-base-100 border-base-content/10 h-12 px-5 rounded-xl font-bold text-sm text-base-content focus:border-primary w-full"
                                value={movie.releaseYear}
                                onChange={(e) => setMovie({ ...movie, releaseYear: e.target.value })}
                            />
                        </div>

                        {/* Poster URL */}
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-base-content/40 uppercase tracking-widest ml-1">Poster URL</label>
                            <input
                                type="text"
                                placeholder="https://..."
                                className="input input-bordered bg-base-100 border-base-content/10 h-12 px-5 rounded-xl font-bold text-sm text-base-content focus:border-primary w-full"
                                value={movie.posterUrl}
                                onChange={(e) => setMovie({ ...movie, posterUrl: e.target.value })}
                            />
                        </div>

                        {/* Favorite Toggle - Full Width */}
                        <div className="form-control md:col-span-2 bg-base-300/50 p-4 rounded-xl border border-base-content/5 group">
                            <label className="label cursor-pointer justify-between p-0">
                                <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest group-hover:text-base-content transition-colors flex items-center gap-2">
                                    <Star size={14} className="text-warning" /> Mark as Favorite
                                </span>
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary border-base-content/20 w-6 h-6 rounded-lg"
                                    checked={movie.isFavorite}
                                    onChange={(e) => setMovie({ ...movie, isFavorite: e.target.checked })}
                                />
                            </label>
                        </div>

                        {/* ACTIONS */}
                        <div className="md:col-span-2 flex items-center gap-4 mt-8 pt-8 border-t border-base-content/5">
                            <button
                                type="submit"
                                className="btn btn-primary flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-xs"
                            >
                                Sync to Cloud
                            </button>
                            <button
                                type="button"
                                className="btn btn-ghost h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); document.getElementById('add_movie_modal').close(); }}
                            >
                                Discard
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
};

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterGenre, setFilterGenre] = useState('All');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [isGenreOpen, setIsGenreOpen] = useState(false);

    const fetchMovies = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/movies');
            setMovies(res.data);
        } catch (error) {
            console.error("Error fetching movies:", error);
            toast.error(error.response?.data?.message || "Failed to fetch movies");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const uniqueGenres = ['All', ...new Set(movies.flatMap(m => Array.isArray(m.genre) ? m.genre : (m.genre ? [m.genre] : [])))];

    const filteredMovies = movies.filter(m => {
        const matchesSearch = (m.title || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = filterGenre === 'All' ||
            (Array.isArray(m.genre) ? m.genre.includes(filterGenre) : m.genre === filterGenre);
        const matchesFavorite = showFavoritesOnly ? m.isFavorite === true : true;
        const matchesStatus = filterStatus === 'All' || m.watchStatus === filterStatus;
        return matchesSearch && matchesGenre && matchesFavorite && matchesStatus;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 className="w-4 h-4" />;
            case 'Watching': return <PlayCircle className="w-4 h-4" />;
            case 'Plan to Watch': return <Clock className="w-4 h-4" />;
            default: return <Library className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-base-100">
            <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="container mx-auto p-4 md:p-8 max-w-[1400px] flex-grow">
                {/* Header Section - Tightened padding */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-base-content/10 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                            <LayoutGrid className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 uppercase">
                                <span className="text-base-content">Movie</span>
                                <span className="text-primary">Archive</span>
                            </h1>
                            <span className="text-[10px] text-base-content/40 font-mono tracking-widest uppercase mt-1">
                                System Status: Online
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filters Section - Improved typography and button sizing */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-10">
                    {/* Status Capsule - Fixed Font Size and Padding */}
                    <div className="flex items-center gap-1 bg-base-200 p-1 rounded-xl border border-base-content/5 overflow-x-auto no-scrollbar">
                        {['All', 'Plan to Watch', 'Watching', 'Completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase shrink-0 transition-all flex items-center gap-2 ${filterStatus === status
                                    ? 'bg-primary text-primary-content'
                                    : 'text-base-content/60 hover:text-base-content hover:bg-base-300'
                                    }`}
                            >
                                {getStatusIcon(status)}
                                <span>{status === 'All' ? 'ALL' : status}</span>
                            </button>
                        ))}
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                        <button
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all h-11 ${showFavoritesOnly
                                ? 'bg-warning/10 text-warning border-warning/40'
                                : 'bg-base-200 border-base-content/10 text-base-content/60 hover:text-base-content hover:border-base-content/40'
                                }`}
                        >
                            <Star className="w-4 h-4" fill={showFavoritesOnly ? "currentColor" : "none"} />
                            <span className="text-[10px] font-bold tracking-widest uppercase">FAVORITES</span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setIsGenreOpen(!isGenreOpen)}
                                className="flex justify-between items-center gap-3 px-4 py-2 bg-base-200 border border-base-content/10 rounded-xl text-base-content/60 hover:text-base-content hover:border-base-content/40 transition-all h-11 min-w-[150px]"
                            >
                                <span className="text-[10px] font-bold tracking-widest uppercase truncate">
                                    {filterGenre === 'All' ? 'ALL GENRES' : filterGenre}
                                </span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isGenreOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isGenreOpen && (
                                <div className="absolute top-[calc(100%+8px)] left-0 w-full max-h-72 overflow-y-auto bg-base-200 border border-base-content/10 rounded-xl p-1 z-[100] shadow-2xl">
                                    {uniqueGenres.map(genre => (
                                        <button
                                            key={genre}
                                            onClick={() => { setFilterGenre(genre); setIsGenreOpen(false); }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all mb-1 ${filterGenre === genre ? 'bg-primary text-primary-content' : 'text-base-content/60 hover:bg-base-300 hover:text-base-content'}`}
                                        >
                                            {genre || "UNKNOWN"}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* This component likely contains its own styling, ensure it matches h-[46px] */}
                        <AddMovie fetchMovies={fetchMovies} />
                    </div>
                </div>

                {/* Content Area */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-32">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : movies.length === 0 ? (
                    <div className="text-center py-32 flex flex-col items-center">
                        <div className="bg-base-200 border border-base-content/10 p-8 rounded-full mb-6">
                            <Library className="w-12 h-12 text-base-content/20" />
                        </div>
                        <h3 className="text-2xl font-bold text-base-content uppercase tracking-tight mb-2">
                            Archive is <span className="text-primary">Empty</span>
                        </h3>
                        <p className="text-[10px] text-base-content/40 font-mono tracking-widest uppercase max-w-sm mb-8">
                            Start by adding your first movie to the archive.
                        </p>
                        <button
                            onClick={() => document.getElementById('add_movie_modal').showModal()}
                            className="btn btn-primary btn-md px-8 rounded-xl font-bold uppercase tracking-widest"
                        >
                            Add First Movie
                        </button>
                    </div>
                ) : filteredMovies.length === 0 ? (
                    <div className="text-center py-32 flex flex-col items-center">
                        <div className="bg-base-200 border border-base-content/10 p-8 rounded-full mb-6">
                            <SearchX className="w-12 h-12 text-base-content/20" />
                        </div>
                        <h3 className="text-2xl font-bold text-base-content uppercase tracking-tight mb-2">
                            No <span className="text-primary">Results</span> Found
                        </h3>
                        <p className="text-[10px] text-base-content/40 font-mono tracking-widest uppercase max-w-sm mb-8">
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setFilterGenre('All'); setFilterStatus('All'); setShowFavoritesOnly(false); }}
                            className="btn btn-ghost border border-base-content/10 px-8 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {filteredMovies.map((movie) => (
                            <MovieCard key={movie._id} movie={movie} setMovies={setMovies} fetchMovies={fetchMovies} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;