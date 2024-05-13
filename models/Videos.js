import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  videoUrl: String
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

export default Video;
