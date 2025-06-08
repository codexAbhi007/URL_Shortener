import express from "express";
import {
  shortenURL,
  redirectURL,
  getAllUrls,
  deleteURL,
  updateShortCode,
} from "../controllers/urlController.js";
import { verifyAuthentication } from "../middlewares/verify-auth-middleware.js";

const router = express.Router();

router.post("/", verifyAuthentication, shortenURL);
router.get("/view", verifyAuthentication, getAllUrls);
router.delete("/:code", verifyAuthentication, deleteURL);
router.patch("/:code",verifyAuthentication,updateShortCode)
router.get("/:code", redirectURL);

export const urlRoutes = router;
