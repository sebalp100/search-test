import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  imageUrl: String,
  metadata: { type: mongoose.Schema.Types.ObjectId, ref: 'ImageMetadata' }
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

export default Image;
