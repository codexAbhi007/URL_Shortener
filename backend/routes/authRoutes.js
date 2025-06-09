import express from "express";
import {  generateCode, getProfile, logout,postLogin,postRegister } from "../controllers/authController.js";
import { verifyAuthentication } from "../middlewares/verify-auth-middleware.js";

const router= express.Router()

router.route("/register").post(postRegister);
router.post("/email/generate",generateCode)
router.route("/login").post(postLogin)
router.get("/logout",verifyAuthentication,logout)
router.get("/profile",verifyAuthentication,getProfile);
export const authRoutes= router