import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const MovieDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMovie = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/movies/${id}`);
            setMovie(res.data);
        } catch (error) {
            console.error("Error fetching movie:", error);
            toast.error(error.response?.data?.message || "Failed to fetch movie");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMovie();
    }, [id]);

    const handleDelete = async () => {
        try {
            await api.delete(`/movies/${id}`);
            toast.success("Movie deleted successfully");
            navigate('/');
        } catch (error) {
            console.error("Error deleting movie:", error);
            toast.error("Failed to delete movie");
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 flex justify-center py-20">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="container mx-auto p-4 text-center">
                <h2 className="text-2xl mt-10">Movie not found</h2>
                <Link to="/" className="btn btn-primary mt-4">Go Home</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <Link to="/" className="btn btn-ghost mb-6">← Back to Watchlist</Link>

            <div className="card lg:card-side bg-[#1e293b]/40 backdrop-blur-3xl border border-white/10 shadow-xl overflow-hidden rounded-[2.5rem]">
                <figure className="lg:w-1/3 bg-base-300 min-h-[300px]">
                    {movie.posterUrl ? (
                        <img src={movie.posterUrl} alt={movie.title} className="object-cover w-full h-full" />
                    ) : (
                        <span className="opacity-50">No Poster</span>
                    )}
                </figure>
                <div className="card-body lg:w-2/3 p-8">
                    <h2 className="card-title text-4xl font-black italic uppercase tracking-tighter text-white">{movie.title}</h2>
                    <div className="flex gap-2 my-4 flex-wrap">
                        <span className="badge badge-primary h-8 px-4 font-bold">{movie.type === 'Series' ? '📺 Series' : '🎬 Movie'}</span>
                        <span className="badge badge-outline h-8 px-4 font-bold border-white/10">{movie.releaseYear}</span>
                        {Array.isArray(movie.genre) ? movie.genre.map((g, index) => (
                            <span key={index} className="badge badge-outline h-8 px-4 font-bold border-white/10">{g}</span>
                        )) : movie.genre && <span className="badge badge-outline h-8 px-4 font-bold border-white/10">{movie.genre}</span>}
                    </div>

                    <div className="divider opacity-10"></div>

                    <div className="flex flex-col gap-2">
                        <p className="text-white/40 text-sm font-bold tracking-widest uppercase">Platform: <span className="text-white ml-2">{movie.streamingPlatform || "N/A"}</span></p>
                        <p className="text-white/40 text-sm font-bold tracking-widest uppercase">Status: <span className="text-white ml-2">{movie.watchStatus}</span></p>
                        <p className="text-white/40 text-sm font-bold tracking-widest uppercase">Rating: <span className="text-amber-400 ml-2">{movie.rating}/10</span></p>
                    </div>

                    <div className="card-actions justify-end mt-8">
                        <button className="btn btn-error btn-outline h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs" onClick={handleDelete}>Delete Entry</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;
