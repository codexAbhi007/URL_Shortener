import express from "express"
import "dotenv/config";
import { urlRoutes } from "./routes/urLRoutes.js";
import cors from 'cors'
import { authRoutes } from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";


const app = express()

app.use(cors());

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser())
app.use('/app',authRoutes)
app.use('/shorten',urlRoutes)
export default app;