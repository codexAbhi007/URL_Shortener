import { eq } from "drizzle-orm";
import { db } from "../config/drizzleDB.js";
import { usersTable } from "../models/drizzleSchema.js";

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
