import express from "express";
import { getLoginPage, getProfile, getRegisterPage,postLogin,postRegister } from "../controllers/authController.js";
import { verifyAuthentication } from "../middlewares/verify-auth-middleware.js";

const router= express.Router()

router.route("/register").get(getRegisterPage).post(postRegister);
router.route("/login").get(getLoginPage).post(postLogin)
router.get("/profile",verifyAuthentication,getProfile);
export const authRoutes= router