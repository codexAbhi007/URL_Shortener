import express from "express";
import {  generateCode, generateEmailAfterLogin, getProfile, logout,postLogin,postRegister, verifyEmail } from "../controllers/authController.js";
import { verifyAuthentication } from "../middlewares/verify-auth-middleware.js";

const router= express.Router()

router.route("/register").post(postRegister);
router.post("/email/generate",generateCode)
router.post("/email/verify", verifyAuthentication,verifyEmail)
router.route("/login").post(postLogin)
router.get("/logout",verifyAuthentication,logout)
router.get("/profile",verifyAuthentication,getProfile);

router.post("/profile/email/generate",verifyAuthentication,generateEmailAfterLogin)
export const authRoutes= router