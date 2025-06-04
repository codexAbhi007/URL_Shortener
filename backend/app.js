import express from "express"
import "dotenv/config";
import { urlRoutes } from "./routes/urLRoutes.js";


const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use('/shorten',urlRoutes)

export default app;