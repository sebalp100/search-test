import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  url: String,
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  textInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TextInfo' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Url = mongoose.model('Url', urlSchema);

export default Url;
