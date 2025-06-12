import crypto from "crypto";
import { eq, desc, and } from "drizzle-orm";
import { db } from "../config/drizzleDB.js";
import { shortLinksTable } from "../models/drizzleSchema.js";
import { urlSchema } from "../utils/validateUrl.js";

const generateShortCode = (length = 6) => {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
};

// Create a short URL for the current user
export const shortenURL = async (req, res) => {
  try {
    const parsed = urlSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const userId = req.user?.id;
    console.log(userId)
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { originalUrl, customCode } = parsed.data;

    // Check if URL already exists for this user
    const existingUrl = await db
      .select()
      .from(shortLinksTable)
      .where(
        and(eq(shortLinksTable.originalUrl, originalUrl),
        eq(shortLinksTable.userId, userId))
        
      );
      console.log(existingUrl)
    if (existingUrl.length > 0) {
      return res.status(409).json({
        message: "URL already exists",
        shortCode: existingUrl[0].shortCode,
      });
    }

    const normalizedCustomCode =
      customCode && customCode.trim() !== "" ? customCode.trim() : null;
    let shortCode = normalizedCustomCode || generateShortCode(6);

    let exists = await db
      .select()
      .from(shortLinksTable)
      .where(eq(shortLinksTable.shortCode, shortCode));

    while (!customCode && exists.length > 0) {
      shortCode = generateShortCode(6);
      exists = await db
        .select()
        .from(shortLinksTable)
        .where(eq(shortLinksTable.shortCode, shortCode));
    }

    if (customCode && exists.length > 0) {
      return res.status(409).json({ message: "Short code Not Available" });
    }

    await db.insert(shortLinksTable).values({ originalUrl, shortCode, userId });

    res.status(201).json({ shortCode, originalUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Redirect using shortcode
export const redirectURL = async (req, res) => {
  try {
    const { code } = req.params;

    const found = await db
      .select()
      .from(shortLinksTable)
      .where(eq(shortLinksTable.shortCode, code));

    if (found.length > 0) {
      return res.redirect(found[0].originalUrl);
    }

    res.status(404).json({ message: "URL not found" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all URLs of the logged-in user
export const getAllUrls = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const urls = await db
      .select()
      .from(shortLinksTable)
      .where(eq(shortLinksTable.userId, userId))
      .orderBy(desc(shortLinksTable.createdAt));

    res.status(200).json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE /shorten/:code
export const deleteURL = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { code } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const deleted = await db
      .delete(shortLinksTable)
      .where(and(eq(shortLinksTable.shortCode, code), eq(shortLinksTable.userId, userId)));

    if (deleted.rowCount === 0) {
      return res.status(404).json({ message: "Short URL not found or not authorized" });
    }

    res.status(200).json({ message: "Short URL deleted successfully" });
  } catch (err) {
    console.error("Error deleting URL:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const updateShortCode = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { code } = req.params;
    const { originalUrl, newCode } = req.body;

    // Authorization check
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Validate inputs
    if (!newCode || newCode.trim() === "") {
      return res.status(400).json({ message: "New short code cannot be empty" });
    }
    if (!originalUrl || originalUrl.trim() === "") {
      return res.status(400).json({ message: "Original URL cannot be empty" });
    }
    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    // Check if new short code already exists
    const existing = await db
      .select()
      .from(shortLinksTable)
      .where(eq(shortLinksTable.shortCode, newCode.trim()));
    if (existing.length > 0) {
      return res.status(409).json({ message: "Short code already taken" });
    }

    // Update both shortCode and originalUrl
    const updated = await db
      .update(shortLinksTable)
      .set({
        shortCode: newCode.trim(),
        originalUrl: originalUrl.trim(),
      })
      .where(and(eq(shortLinksTable.shortCode, code), eq(shortLinksTable.userId, userId)));

    // Check if update was successful
    if (updated[0].affectedRows === 0) {
      return res.status(404).json({ message: "Short URL not found or not authorized" });
    }

    res.status(200).json({
      message: "Short link updated successfully",
      shortCode: newCode.trim(),
      originalUrl: originalUrl.trim(),
    });
  } catch (err) {
    console.error("Error updating short link:", err);
    res.status(500).json({ message: "Server error" });
  }
};