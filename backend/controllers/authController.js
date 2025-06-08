import { eq } from "drizzle-orm";
import { db } from "../config/drizzleDB.js";
import { usersTable } from "../models/drizzleSchema.js";
import {
  usernameSchema,
  emailSchema,
  passwordSchema,
} from "../models/zodPassSchema.js";
import * as AuthService from "../services/auth.services.js";

export const postRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Step-by-step validation with Zod
    const usernameResult = usernameSchema.safeParse(username);
    if (!usernameResult.success) {
      return res
        .status(400)
        .json({ message: usernameResult.error.errors[0].message });
    }

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      return res
        .status(400)
        .json({ message: emailResult.error.errors[0].message });
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      return res
        .status(400)
        .json({ message: passwordResult.error.errors[0].message });
    }

    // Check if user already exists
    const userExists = await AuthService.getUserByEmail(email);
    if (userExists) {
      return res
        .status(409)
        .json({ message: "User already exists! Sign In instead." });
    }

    const hashedPassword = await AuthService.generateHash(password);

    // Create user

    await AuthService.createUser({
      username,
      email,
      password: hashedPassword,
    });

    const user = await AuthService.getUserByEmail(email)
    // console.log(user)
    const session = await AuthService.createSession(user.id, {
      ip: req.clientIp,
      userAgent: req.headers["user-agent"],
    });

    const accessToken = AuthService.createAccessToken({
      id: user.id,
      username: user.username,
      email: user.email,
      sessionId: session.id,
    });
    const refreshToken = AuthService.createRefreshToken(session.id);

    res
      .status(201)
      .cookie("accessToken", accessToken, {
        expires: new Date(
          Date.now() + process.env.ACCESS_TOKEN_COOKIE_EXPIRE * 60 * 100
        ),
        httpOnly: true,
        secure: true,
      })
      .cookie("refreshToken", refreshToken, {
        expires: new Date(
          Date.now() +
            process.env.REFRESH_TOKEN_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,
      })
      .json({
        message: "Resgistration Successful",
        accessToken,
        refreshToken,
        user,
      });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Something went wrong while registering. Please try again.",
    });
  }
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await AuthService.getUserByEmail(email);
  if (!user) {
    return res
      .status(409)
      .json({ message: "User does not Exists! Register First" });
  }

  const compare = await AuthService.comparePass(password, user.password);

  if (!compare) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const session = await AuthService.createSession(user.id, {
    ip: req.clientIp,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = AuthService.createAccessToken({
    id: user.id,
    username: user.username,
    email: user.email,
    sessionId: session.id,
  });
  const refreshToken = AuthService.createRefreshToken(session.id);

  res
    .status(201)
    .cookie("accessToken", accessToken, {
      expires: new Date(
        Date.now() + process.env.ACCESS_TOKEN_COOKIE_EXPIRE * 60 * 100
      ),
      httpOnly: true,
      secure: true,
    })
    .cookie("refreshToken", refreshToken, {
      expires: new Date(
        Date.now() +
          process.env.REFRESH_TOKEN_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
    })
    .json({
      message: "Login Successful",
      accessToken,
      refreshToken,
      user,
    });
  // return res
  //   .status(201)
  //   .cookie("access_token", token, {
  //     expires: new Date(
  //       Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  //     ),
  //     httpOnly: true,
  //   })
  //   .json({
  //     message: "Login successful",
  //     token,
  //     user,
  //   });
};

// export const logout = async (req, res) => {
//   res
//     .status(200)
//     .cookie("access_token", "", {
//       expires: new Date(Date.now()),
//       httpOnly: true,
//     })
//     .json({
//       success: true,
//       message: "Logged Out Successfully",
//     });
// };

export const logout = async (req, res) => {
  try {
    await AuthService.clearSession(req.user.sessionId);

    res
      .cookie("accessToken", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
      })
      .cookie("refreshToken", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "Logged out Successfully",
      });
  } catch (error) {
    console.log(error);
  }
};

// controllers/auth.controller.js
export const getProfile = (req, res) => {
  const { id, username, email } = req.user;
  return res.status(200).json({
    message: "User profile fetched successfully",
    user: { id, username, email },
  });
};
