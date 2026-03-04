import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js"
import { connectDB } from "./config/db.js"
dotenv.config()
const app = express();
const port = process.env.PORT || 3001
app.use(cors(
    {
        //origin: 'http://localhost:5173'
    }
))
app.use(express.json())
app.use("/movies", movieRoutes)
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`http://localhost:${port}/movies`)
    })
})
