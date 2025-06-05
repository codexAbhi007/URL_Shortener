import express from "express";
import { shortenURL,redirectURL,getAllUrls } from "../controllers/urlController.js";


const router = express.Router();

router.post("/", shortenURL);
router.get('/view', getAllUrls);
router.get("/:code", redirectURL);


export const urlRoutes = router