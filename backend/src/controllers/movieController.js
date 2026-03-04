import Movie from "../models/movieModel.js";


export const createMovie = async (req, res) => {
    const newMovie = new Movie(req.body);
    try {
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (err) {
        res.status(500).json(err);
    }
};


export const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json(err);
    }
};


export const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json("Movie not found!");
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
};


export const updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedMovie);
    } catch (err) {
        res.status(500).json(err);
    }
};


export const deleteMovie = async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json("Movie deleted successfully!");
    } catch (err) {
        res.status(500).json(err);
    }
};