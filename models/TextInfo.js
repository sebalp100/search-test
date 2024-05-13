import mongoose from "mongoose";

const textInfoSchema = new mongoose.Schema({
  content: String
}, { timestamps: true });

const TextInfo = mongoose.model('TextInfo', textInfoSchema);

export default TextInfo;
