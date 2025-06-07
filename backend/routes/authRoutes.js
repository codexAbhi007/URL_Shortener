import express from "express";
import {  getProfile, logout,postLogin,postRegister } from "../controllers/authController.js";
import { verifyAuthentication } from "../middlewares/verify-auth-middleware.js";

const router= express.Router()

router.route("/register").post(postRegister);
router.route("/login").post(postLogin)
router.get("/logout",verifyAuthentication,logout)
router.get("/profile",verifyAuthentication,getProfile);
export const authRoutes= router