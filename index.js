import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import ExifReader from 'exifreader';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import helmet from 'helmet';
import cors from 'cors';
import authRoute from './routes/auth.route.js';
import crawlRoute from './routes/crawl.route.js';
import mongoose from 'mongoose';
import Image from './models/Images.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

let contentDatabase = [];

const crawlWebsite = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const images = $('img').map((index, element) => url + $(element).attr('src')).get();
    const videos = $('video').map((index, element) => $(element).attr('src')).get();
    const writtenContent = $('h3').map((index, element) => $(element).text()).get();
    return { images, videos, writtenContent };
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

const saveToJsonFile = (data) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync('contentDatabase.json', jsonData);
  console.log('Data saved to contentDatabase.json');
};

app.post('/crawl', async (req, res) => {
  const { url } = req.body;
  const content = await crawlWebsite(url);
  if (content) {
    const imagesExifMetadataMap = {};
    await Promise.all(content.images.map(async (imageUrl) => {
      const exifMetadata = await getImageExifMetadata(imageUrl);
      if (exifMetadata) {
        const filteredMetadata = {
          'Image Height': exifMetadata['Image Height'],
          'Image Width': exifMetadata['Image Width'],
          'FileType': exifMetadata['FileType'],
        };
        imagesExifMetadataMap[imageUrl] = filteredMetadata;
      }
    }));
    contentDatabase.push({ url, content, imagesExifMetadataMap });
    saveToJsonFile(contentDatabase);
    res.status(200).json({ message: 'Website crawled successfully', content, imagesExifMetadataMap });
  } else {
    res.status(500).json({ message: 'Failed to crawl website' });
  }
});

app.use("/api/auth", authRoute);
app.use("/api/crawl", crawlRoute);

mongoose.connect(process.env.DATABASE_URL).then(() => {
  app.listen(PORT, () => console.log(`Server port ${PORT}`))
}).catch((error) => console.log(error))
