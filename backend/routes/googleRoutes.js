import express from "express"
import { getGoogleLoginCallback, getGoogleLoginPage } from "../controllers/authController.js";

const router = express.Router();

router.route("/google").get(getGoogleLoginPage)
router.route("/google/callback").get(getGoogleLoginCallback);

export const googleRoutes = router