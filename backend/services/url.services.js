import { eq } from "drizzle-orm";
import { db } from "../config/drizzleDB.js";
import { shortLinksTable } from "../models/drizzleSchema.js";

export const getAllLinks = async (userId) => {
  return await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.userId, userId));
};
