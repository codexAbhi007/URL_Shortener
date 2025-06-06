import express from "express";
import { getLoginPage, getRegisterPage,postLogin,postRegister } from "../controllers/authController.js";

const router= express.Router()

router.route("/register").get(getRegisterPage).post(postRegister);
router.route("/login").get(getLoginPage).post(postLogin)

export const authRoutes= router