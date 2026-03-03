import express from "express";
import {
    createMovie,
    deleteMovie,
    getMovies,
    getMovieById,
    updateMovie
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", createMovie);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

export default router;
