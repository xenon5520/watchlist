import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Movie', 'Series'], required: true },
  genre: [{ type: String, required: true }],
  rating: { type: Number, min: 1, max: 10 },
  watchStatus: { type: String, default: 'Plan to Watch' },
  streamingPlatform: { type: String },
  releaseYear: { type: Number },
  posterUrl: { type: String },
  isFavorite: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Movie', movieSchema);