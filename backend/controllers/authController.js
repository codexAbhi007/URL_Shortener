import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import {
  usernameSchema,
  emailSchema,
  passwordSchema,
} from "../models/zodPassSchema.js";
import * as AuthService from "../services/auth.services.js";
import { sendEmail } from "../services/sendEmail.js";
import { getAllLinks } from "../services/url.services.js";
import { generateEmailTemplate } from "../templates/emailTemplate.js";
import { google } from "../lib/oauth/google.js";

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

    const user = await AuthService.getUserByEmail(email);
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


  if(!user.password){
    return res.status(409).json({message: `You have already created Account with email ${email} using social Login, Please Login with your social account`})
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
export const getProfile = async (req, res) => {
  const { id } = req.user;

  const user = await AuthService.findUserById(id);

  const shortLinks = await getAllLinks(id);

  return res.status(200).json({
    message: "User profile fetched successfully",
    user: {
      id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      links: shortLinks.length,
      verified: user.verified,
    },
  });
};

export const generateCode = async (req, res) => {
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

    const user = await AuthService.getUserByEmail(email);
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
      });

    const verificationCode =
      AuthService.generateRandomSixDigitCode().toString();
    console.log(verificationCode);
    console.log("hello");

    const createdAt = new Date(Date.now());
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await AuthService.setTokenDB({
      token: verificationCode,
      userId: user.id,
      createdAt,
      expiresAt,
    });

    const message = generateEmailTemplate(verificationCode);
    sendEmail({
      email: user.email,
      subject: "Your Verification Code",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Verification email sent successfully to ${user.email}`,
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Something went wrong while Sending Code. Please try again.",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { id, userCode } = req.body;
    const [userEntry] = await AuthService.getTokenById(id);
    console.log(userEntry);
    console.log(userEntry.token);
    if (!userEntry) return res.status(401).json({ message: "No user Found!" });
    if (Number(userEntry.token) !== Number(userCode))
      return res.status(401).json({ message: "Invalid OTP" });

    const currentTime = Date.now();
    const verificationCodeExpire = new Date(userEntry.expiresAt).getTime();

    // console.log(currentTime,verificationCodeExpire)
    // console.log(currentTime > verificationCodeExpire)
    console.log("hello");
    if (currentTime > verificationCodeExpire) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    const user = await AuthService.updateUserVerification(id);
    console.log(user);

    res.json({ message: true, message: "Email Verified!" });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const generateEmailAfterLogin = async (req, res) => {
  const { id, email } = req.body;
  try {
    const verificationCode =
      AuthService.generateRandomSixDigitCode().toString();
    console.log(verificationCode);
    console.log("hello");

    const createdAt = new Date(Date.now());
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const tableId = await AuthService.setTokenDB({
      token: verificationCode,
      userId: id,
      createdAt,
      expiresAt,
    });

    const message = generateEmailTemplate(verificationCode);
    sendEmail({
      email: email,
      subject: "Your Verification Code",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Verification email sent successfully to ${email}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

//getGoogleLoginPage
export const getGoogleLoginPage = async (req, res) => {
  console.log("hello");
  if (req.user) return res.status(200).json({ message: true, user: req.user });

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ]);

  const cookieConfig = {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 5 * 60 * 1000),
    sameSite: "lax",
  };

  res
    .cookie("google_oauth_state", state, cookieConfig)
    .cookie("google_code_verifier", codeVerifier, cookieConfig);
  res.redirect(url.toString());
};

export const getGoogleLoginCallback = async (req, res) => {
  const { code, state } = req.query;
  console.log(code, state);

  const {
    google_oauth_state: storedState,
    google_code_verifier: codeVerifier,
  } = req.cookies;

  if (!code || !state || !storedState || !codeVerifier) {
    res.status(401).json({ message: "Server Error" });
    res.redirect("http://localhost:5173/app/login");
  }

  let tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (error) {
    console.log(error);
    return res.redirect("http://localhost:5173/app/login");
  }

  console.log("token google: ", tokens);

  const claims = decodeIdToken(tokens.idToken());
  const { sub: googleuserId, username, email } = claims;

  let user = await AuthService.getUserWithOauthId({
    provider: "google",
    email,
  });

  if (user && !user.providerAccountId) {
    await AuthService.linkUserwithOauth({
      user: user.id,
      provider: "google",
      providerAccountId: googleuserId,
    });
  }

  if (!user) {
    user = await AuthService.createUserWithOauth({
      username,
      email,
      provider: "google",
      providerAccountId: googleuserId,
    });
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

  return res
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
    .redirect("http://localhost:5173/app/profile")
};
