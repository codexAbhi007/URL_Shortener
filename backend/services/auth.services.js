import { eq } from "drizzle-orm";
import { db } from "../config/drizzleDB.js";
import { usersTable } from "../models/drizzleSchema.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken"


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


export const generateToken = ({id,username,email})=>{
    return jwt.sign({id,username,email},process.env.JWT_SECRET,{
        expiresIn:"30d"
    })
}

export const verifyJWTtoken = (token) => {
    return jwt.verify(token,process.env.JWT_SECRET)
}