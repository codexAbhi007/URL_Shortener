import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  shortCode: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const URL = mongoose.model('URL', urlSchema);
