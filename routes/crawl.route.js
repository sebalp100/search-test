import express from 'express';
import { crawl } from '../controllers/crawl.controller.js';

const router = express.Router();

router.post("/", crawl);


export default router;
