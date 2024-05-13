import mongoose from "mongoose";

const imageMetadataSchema = new mongoose.Schema({
  imageHeight: String,
  imageWidth: String,
  fileType: String,
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' }
}, { timestamps: true });

const ImageMetadata = mongoose.model('ImageMetadata', imageMetadataSchema);

export default ImageMetadata;
