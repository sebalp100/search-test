import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  avatar: String,
  urls: [String],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
