import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  lastLocation: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    updatedAt: { type: Date, default: null },
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);