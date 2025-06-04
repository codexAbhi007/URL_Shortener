import express from "express";
import { shortenURL,redirectURL } from "../controllers/urlController.js";


const router = express.Router();

router.post("/", shortenURL);
router.get("/:code", redirectURL);


export const urlRoutes = router