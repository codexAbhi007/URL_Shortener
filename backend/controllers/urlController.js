import crypto from "crypto";
import { URL } from "../models/urlModel.js";
import { urlSchema } from "../utils/validateUrl.js";

const generateShortCode = (length = 6) => {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
};

export const shortenURL = async (req, res) => {
  try {
    const parsed = urlSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { originalUrl, customCode } = parsed.data;

    // Check if originalUrl already exists
    const existingUrl = await URL.findOne({ originalUrl });
    if (existingUrl) {
      return res.status(409).json({ message: "URL already exists", shortCode: existingUrl.shortCode });
    }

  const normalizedCustomCode = customCode && customCode.trim() !== "" ? customCode.trim() : null;
    let shortCode = normalizedCustomCode || generateShortCode(6);

    let exists = await URL.findOne({ shortCode });
    while (!customCode && exists) {
      shortCode = generateShortCode(6);
      exists = await URL.findOne({ shortCode });
    }

    if (customCode && exists) {
      return res.status(409).json({ message: "Short code already exists" });
    }

    await URL.create({ shortCode, originalUrl });
    res.status(201).json({ shortCode, originalUrl });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server Error" });
  }
};
export const redirectURL = async (req, res) => {
  try {
    const { code } = req.params;
    const found = await URL.findOne({ shortCode: code });
    if (found) {
      return res.redirect(found.originalUrl);
    }
    res.status(404).json({ message: 'URL not found' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUrls = async (req, res) => {
  try {
    const urls = await URL.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
