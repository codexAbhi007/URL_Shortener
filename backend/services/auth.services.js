import { eq } from "drizzle-orm";
import { db } from "../config/drizzleDB.js";
import {
  sessionsTable,
  usersTable,
  verifyEmailTokensTable,
} from "../models/drizzleSchema.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const getUserByEmail = async (email) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return user; // <-- Add this line
};

export const createUser = async ({ username, email, password }) => {
  return await db
    .insert(usersTable)
    .values({ username, email, password })
    .$returningId();
};

export const generateHash = async (password) => {
  return await argon2.hash(password);
};

export const comparePass = async (password, hash) => {
  return await argon2.verify(hash, password);
};

export const generateToken = ({ id, username, email }) => {
  return jwt.sign({ id, username, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyJWTtoken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const createSession = async (userId, { ip, userAgent }) => {
  const [session] = await db
    .insert(sessionsTable)
    .values({ userId: userId, ip, userAgent })
    .$returningId();

  return session;
};

//create access token
export const createAccessToken = ({ id, username, email, sessionId }) => {
  return jwt.sign({ id, username, email, sessionId }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });
};

export const createRefreshToken = (sessionId) => {
  return jwt.sign({ sessionId }, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });
};

export const findSessionById = async (sessionId) => {
  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.id, sessionId));

  return session;
};

export const findUserById = async (userId) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  return user;
};

export const refreshTokens = async (refreshToken) => {
  try {
    const decodedToken = verifyJWTtoken(refreshToken);
    // console.log("refresh Token: ", refreshToken);
    // console.log(decodedToken);
    const currentSession = await findSessionById(decodedToken.sessionId);
    // console.log(currentSession);
    if (!currentSession || !currentSession.valid) {
      throw new Error("Invalid Session");
    }
    // console.log(currentSession.userId);
    const user = await findUserById(currentSession.userId);

    if (!user) throw new Error("Invalid User");

    const userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      sessionId: currentSession.id,
    };

    const new_accessToken = createAccessToken(userInfo);
    const new_refreshToken = createRefreshToken(currentSession.id);
    // console.log(new_accessToken, new_refreshToken);

    return {
      new_accessToken,
      new_refreshToken,
      user: userInfo,
    };
  } catch (err) {
    console.log(err);
  }
};

export const clearSession = async (sessionId) => {
  return db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
};

export const generateRandomSixDigitCode = () => {
  const firstDigit = Math.floor(Math.random() * 9) + 1; // 1-9
  const remainingDigits = Math.floor(Math.random() * 100000) // 0 - 99999
    .toString()
    .padStart(5, "0"); // ensure it’s always 5 digits

  return parseInt(firstDigit + remainingDigits); // e.g. 100001 to 999999
};

export const setTokenDB = async ({ token, userId, createdAt, expiresAt }) => {
  return await db
    .insert(verifyEmailTokensTable)
    .values({ userId, token, expiresAt, createdAt })
    .$returningId();
};
