import express from "express"
import "dotenv/config";
import { urlRoutes } from "./routes/urLRoutes.js";
import cors from 'cors'
import { authRoutes } from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
// import { verifyAuthentication } from "./middlewares/verify-auth-middleware.js";


const app = express()

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true,
  })
);

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use('/shorten',urlRoutes)
app.use('/app',authRoutes)
export default app;