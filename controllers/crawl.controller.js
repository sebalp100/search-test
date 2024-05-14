import axios from 'axios';
import * as cheerio from 'cheerio';
import ExifReader from 'exifreader';
import Url from '../models/Url.js';
import Image from '../models/Images.js'
import Video from '../models/Videos.js'
import TextInfo from '../models/TextInfo.js'
import User from '../models/User.js';
import ImageMetadata from '../models/ImageMetadata.js';
import schedule from "node-schedule";

export const crawl = async (req, res) => {
  const { url, userId } = req.body;

  let contentDatabase = [];

  const crawlWebsite = async (url) => {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const images = $('img').map((index, element) => url + $(element).attr('src')).get();
      const videos = $('video').map((index, element) => $(element).attr('src')).get();
      const textInfo = $('h3').map((index, element) => $(element).text()).get();
      return { images, videos, textInfo };

    } catch (error) {
      console.error('Error crawling website:', error);
      return null;
    }
  };

  const getImageExifMetadata = async (imageUrl) => {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const exifData = ExifReader.load(response.data);
      return exifData;
    } catch (error) {
      console.error('Error fetching Exif metadata:', error);
      return null;
    }
  };

  try {
    const user = await User.findById(userId);
    if (user.urls.includes(url)) {
      return res.status(400).json({ message: 'URL already scrapped by the user' });
    }

    const content = await crawlWebsite(url);
    if (content) {
      const imagesExifMetadataMap = {};
      const createdImages = await Promise.all(content.images.map(async (imageUrl) => {

        const image = await Image.create({ imageUrl });

        const exifMetadata = await getImageExifMetadata(imageUrl);
        if (exifMetadata) {
          const imageMetadata = await ImageMetadata.create({
            imageId: image._id,
            imageHeight: exifMetadata['Image Height'].description,
            imageWidth: exifMetadata['Image Width'].description,
            fileType: exifMetadata['FileType'].description,
          });
        }

        return imageUrl;
      }));

      const createdVideos = await Promise.all(content.videos.map(async (videoUrl) => {
        const video = await Video.create({ videoUrl });
        return videoUrl;
      }));

      const createdTextInfo = await Promise.all(content.textInfo.map(async (info) => {
        const textInfo = await TextInfo.create({ content: info });
        return info;
      }));


      const createdURL = await Url.create({
        url,
        images: createdImages,
        videos: createdVideos,
        textInfo: createdTextInfo,
        createdBy: userId,
      });

      contentDatabase.push({ url: createdURL, content, imagesExifMetadataMap });
      user.urls.push(url);
      await user.save();

      res.status(200).json({ message: 'Scrapped data saved successfully', url: createdURL, content, imagesExifMetadataMap });
    } else {
      res.status(500).json({ message: 'Failed to scrape data from the website' });
    }
  } catch (error) {
    console.error('Error saving scrapped data:', error);
    res.status(500).json({ message: 'Failed to save scrapped data' });
  }
};

export const loadContentByUrl = async (req, res) => {
  const { url } = req.body;
  try {
    const foundUrl = await Url.findOne(url);

    if (!foundUrl) {
      return res.status(404).json({ message: 'URL not found' });
    }

    const { images, videos, textInfo } = foundUrl;

    const content = {
      images,
      videos,
      textInfo,
    };

    return content;
  } catch (error) {
    console.error('Error loading content by URL:', error);
  }
};
