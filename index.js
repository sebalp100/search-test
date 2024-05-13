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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use("/api/auth", authRoute);
app.use("/api/crawl", crawlRoute);

mongoose.connect(process.env.DATABASE_URL).then(() => {
  app.listen(PORT, () => console.log(`Server port ${PORT}`))
}).catch((error) => console.log(error))
