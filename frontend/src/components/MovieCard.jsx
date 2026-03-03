import { useState } from 'react';
import { Trash2, Pencil, Radio, Star, CheckCircle2, PlayCircle, Clock, Save, X, Activity, History, Loader2 } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const EditMovie = ({ movie, fetchMovies, trigger }) => {
    const [updatedMovie, setUpdatedMovie] = useState({
        ...movie,
        genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre
    });

    const [isSyncing, setIsSyncing] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSyncing(true);
        try {
            const token = localStorage.getItem('token');
            const { _id, createdAt, updatedAt, __v, ...dataToSync } = updatedMovie;
            const finalData = {
                ...dataToSync,
                genre: updatedMovie.genre.split(',').map(g => g.trim()).filter(g => g !== "")
            };

            await api.put(`/movies/${movie._id}`, finalData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success(`${movie.title} Synchronized!`);
            document.getElementById(`edit_modal_${movie._id}`).close();
            fetchMovies();
        } catch (err) {
            toast.error("Cloud update failed.");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <>
            <div onClick={() => document.getElementById(`edit_modal_${movie._id}`).showModal()}>
                {trigger || (
                    <button className="btn btn-ghost btn-xs text-base-content/40 hover:text-primary uppercase tracking-widest px-0">
                        <Pencil size={14} /> EDIT
                    </button>
                )}
            </div>

            <dialog id={`edit_modal_${movie._id}`} className="modal">
                <div className="modal-box w-11/12 max-w-xl bg-base-200 border border-base-content/5 rounded-2xl p-8 shadow-2xl">

                    <div className="text-center mb-10">
                        <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                            <Activity className={`text-primary ${isSyncing ? 'animate-spin' : ''}`} size={24} />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight text-base-content uppercase leading-none">
                            Edit <span className="text-primary">Metadata</span>
                        </h3>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <History size={12} className="text-base-content/20" />
                            <p className="text-[10px] font-bold tracking-widest text-base-content/20 uppercase">
                                ID: {movie._id.slice(-8)}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-x-8 gap-y-10">
                        <div className="col-span-1">
                            <label className="label text-[10px] font-bold text-base-content/40 uppercase tracking-widest ml-1">
                                Title
                            </label>
                            <input
                                type="text"
                                className="input input-bordered bg-base-100 border-base-content/10 h-12 px-5 rounded-xl font-bold text-sm tracking-wide focus:border-primary transition-all text-base-content w-full"
                                value={updatedMovie.title}
                                onChange={(e) => setUpdatedMovie({ ...updatedMovie, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="label text-[10px] font-bold text-base-content/40 uppercase tracking-widest ml-1">Media Type</label>
                            <select
                                className="select select-bordered bg-base-100 border-base-content/10 h-12 px-5 rounded-xl font-bold text-sm text-base-content focus:border-primary w-full"
                                value={updatedMovie.type}
                                onChange={(e) => setUpdatedMovie({ ...updatedMovie, type: e.target.value })}
                            >
                                <option value="Movie">Movie</option>
                                <option value="Series">Series</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="label text-[10px] font-bold text-base-content/40 uppercase tracking-widest ml-1">Categories</label>
                            <input
                                type="text"
                                placeholder="Action, Sci-Fi..."
                                className="input input-bordered bg-base-100 border-base-content/10 h-12 px-5 rounded-xl font-bold text-sm tracking-wide focus:border-primary transition-all text-base-content w-full"
                                value={updatedMovie.genre}
                                onChange={(e) => setUpdatedMovie({ ...updatedMovie, genre: e.target.value })}
                                required
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="label text-[10px] font-bold text-base-content/40 uppercase tracking-widest ml-1">Status</label>
                            <select
                                className="select select-bordered bg-base-100 border-base-content/10 h-12 px-5 rounded-xl font-bold text-sm text-base-content focus:border-primary w-full"
                                value={updatedMovie.watchStatus}
                                onChange={(e) => setUpdatedMovie({ ...updatedMovie, watchStatus: e.target.value })}
                            >
                                <option value="Plan to Watch">Plan to Watch</option>
                                <option value="Watching">Watching</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="col-span-1">
                            <label className="label text-[10px] font-bold text-base-content/40 uppercase tracking-widest ml-1">Score</label>
                            <input
                                type="number"
                                min="1" max="10" step="0.1"
                                className="input input-bordered bg-base-100 border-base-content/10 h-12 px-5 rounded-xl font-bold text-sm text-warning focus:border-primary transition-all w-full"
                                value={updatedMovie.rating}
                                onChange={(e) => setUpdatedMovie({ ...updatedMovie, rating: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="label text-[10px] font-bold text-base-content/40 uppercase tracking-widest ml-1">Poster URL</label>
                            <input
                                type="url"
                                className="input input-bordered bg-base-100 border-base-content/10 h-12 px-5 rounded-xl font-bold text-sm tracking-wide focus:border-primary transition-all text-base-content w-full"
                                value={updatedMovie.posterUrl}
                                onChange={(e) => setUpdatedMovie({ ...updatedMovie, posterUrl: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="col-span-2 flex items-center gap-4 mt-8 pt-8 border-t border-base-content/5">
                            <button
                                type="submit"
                                disabled={isSyncing}
                                className={`btn btn-primary flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-sm flex items-center justify-center gap-2 ${isSyncing ? 'cursor-wait opacity-50' : ''}`}
                            >
                                {isSyncing ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        SYNCING...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} /> Sync Changes
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                disabled={isSyncing}
                                className="btn btn-ghost h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px] text-base-content/20 hover:text-base-content disabled:opacity-50"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); document.getElementById(`edit_modal_${movie._id}`).close(); }}
                            >
                                <X size={16} /> Discard
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
};

const MovieCard = ({ movie, setMovies, fetchMovies }) => {
    const fallbackImage = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop";

    const deleteMovie = async (id) => {
        try {
            await api.delete(`/movies/${id}`);
            setMovies((prev) => prev.filter((m) => m._id !== id));
            toast.success("Entry Purged Successfully");
        } catch (error) {
            console.error("Error deleting movie:", error);
            toast.error(error.response?.data?.message || "Failed to delete movie");
        }
    };

    const toggleFavorite = async (id, currentStatus) => {
        try {
            await api.put(`/movies/${id}`, { isFavorite: !currentStatus });
            setMovies((prev) =>
                prev.map(m =>
                    m._id === id ? { ...m, isFavorite: !currentStatus } : m
                )
            );
            toast.success(!currentStatus ? "Added to Favorites" : "Removed from Favorites");
        } catch (error) {
            console.error("Error toggling favorite:", error);
            toast.error("Failed to update favorite status");
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 size={12} strokeWidth={3} />;
            case 'Watching': return <PlayCircle size={12} strokeWidth={3} />;
            default: return <Clock size={12} strokeWidth={3} />;
        }
    };

    return (
        <div className="relative group">
            <div
                className="card bg-base-200 border border-base-content/5 shadow-md overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 group"
            >

                {/* POSTER SECTION - STATIC PERFECT FIT */}
                <figure className="relative h-[28rem] w-full overflow-hidden bg-base-300">
                    {/* Blurred Background Layer (Always Active) */}
                    <img
                        src={movie.posterUrl || fallbackImage}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-30 scale-110"
                    />

                    {/* Main Poster Image - Static Contain */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <img
                            src={movie.posterUrl || fallbackImage}
                            alt={movie.title}
                            className="h-full w-full object-contain rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                            onError={(e) => { e.target.src = fallbackImage; }}
                        />
                    </div>

                    {/* VIGNETTE OVERLAY FOR DEPTH */}
                    <div className="absolute inset-0 bg-gradient-to-t from-base-200/80 via-transparent to-transparent opacity-60 pointer-events-none z-10" />

                    {/* STATUS PILL */}
                    <div className="absolute top-4 left-4 z-20">
                        <div className={`badge badge-sm py-3 px-4 font-bold uppercase tracking-wider border-none shadow-sm ${movie.watchStatus === 'Completed' ? 'badge-success' :
                            movie.watchStatus === 'Watching' ? 'badge-warning' : 'bg-base-100'
                            }`}>
                            {getStatusIcon(movie.watchStatus)} <span className="ml-2">{movie.watchStatus}</span>
                        </div>
                    </div>

                    {/* FAVORITE STAR */}
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(movie._id, movie.isFavorite); }}
                        className={`absolute top-4 right-4 z-20 btn btn-circle btn-xs border-none transition-all ${movie.isFavorite
                            ? 'bg-warning text-warning-content scale-110'
                            : 'bg-black/40 text-white hover:bg-white hover:text-black'
                            }`}
                    >
                        <Star size={16} fill={movie.isFavorite ? "currentColor" : "none"} />
                    </button>
                </figure>

                {/* CONTENT BODY */}
                <div className="p-6 bg-base-200">

                    {/* TITLE & META */}
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-base-content leading-tight mb-2 uppercase line-clamp-1">
                            {movie.title}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="badge badge-primary badge-outline text-[10px] font-bold uppercase tracking-wider">
                                {movie.type || "Movie"}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {Array.isArray(movie.genre) ? movie.genre.map((g, index) => (
                            <span
                                key={index}
                                className="bg-base-300 text-base-content/60 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                            >
                                {g}
                            </span>
                        )) : (
                            <span className="bg-base-300 text-base-content/60 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                {movie.genre || "UNKNOWN"}
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between items-center py-3 px-4 bg-base-300 rounded-xl mb-3 text-[10px] font-bold uppercase">
                        <div className="flex items-center gap-1.5 text-warning">
                            <Star size={12} fill="currentColor" />
                            <span>{movie.rating ? movie.rating : "0.0"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-primary">
                            <Radio size={12} />
                            <span className="text-base-content/80">{movie.streamingPlatform || "NETFLIX"}</span>
                        </div>
                    </div>

                    {/* TIMESTAMPS */}
                    <div className="flex flex-col gap-1 px-1 opacity-40 text-[9px] font-bold uppercase tracking-tight">
                        <div className="flex justify-between border-b border-base-content/5 pb-1">
                            <span>CREATED</span>
                            <span>{new Date(movie.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>UPDATED</span>
                            <span>{new Date(movie.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    {/* ACTION BAR */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-base-content/5">
                        <EditMovie
                            movie={movie}
                            fetchMovies={fetchMovies}
                            trigger={
                                <div className="btn btn-ghost btn-xs text-base-content/40 hover:text-primary uppercase tracking-widest px-0">
                                    <Pencil size={14} /> Edit
                                </div>
                            }
                        />

                        <button
                            className="btn btn-ghost btn-xs text-base-content/20 hover:text-error uppercase tracking-widest px-0"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteMovie(movie._id); }}
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
