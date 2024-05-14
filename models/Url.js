import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  url: String,
  images: [String],
  videos: [String],
  textInfo: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Url = mongoose.model('Url', urlSchema);

export default Url;
