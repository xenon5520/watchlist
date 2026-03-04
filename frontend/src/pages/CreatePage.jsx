import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const CreatePage = () => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('Movie');
    const [releaseYear, setReleaseYear] = useState('');
    const [genre, setGenre] = useState('');
    const [posterUrl, setPosterUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const genreArray = genre.split(',').map(g => g.trim()).filter(Boolean);

        try {
            await api.post('/movies', {
                title,
                type,
                releaseYear: releaseYear ? Number(releaseYear) : undefined,
                genre: genreArray,
                posterUrl
            });
            toast.success('Movie created successfully!');
            navigate('/');
        } catch (error) {
            console.error("Error creating movie:", error);
            toast.error(error.response?.data?.message || "Failed to create movie");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-6">Add New Movie</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Movie Title</span>
                            </label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Enter movie title" className="input input-bordered w-full" required />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Type</span>
                            </label>
                            <select value={type} onChange={(e) => setType(e.target.value)} className="select select-bordered w-full" required>
                                <option value="Movie">Movie</option>
                                <option value="Series">Series</option>
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Release Year</span>
                            </label>
                            <input value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} type="number" placeholder="Release year" className="input input-bordered w-full" />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Genre (comma separated)</span>
                            </label>
                            <input value={genre} onChange={(e) => setGenre(e.target.value)} type="text" placeholder="e.g. Action, Drama, Sci-Fi" className="input input-bordered w-full" required />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Poster URL (Optional)</span>
                            </label>
                            <input value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} type="url" placeholder="https://..." className="input input-bordered w-full" />
                        </div>

                        <div className="card-actions justify-end mt-6">
                            <button type="button" onClick={() => navigate('/')} className="btn btn-ghost">Cancel</button>
                            <button type="submit" disabled={isLoading} className="btn btn-primary">
                                {isLoading ? 'Saving...' : 'Save Movie'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePage;
