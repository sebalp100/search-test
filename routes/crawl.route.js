import express from 'express';
import { crawl, loadContentByUrl } from '../controllers/crawl.controller.js';

const router = express.Router();

router.post("/", crawl);
router.get("/check", loadContentByUrl);


export default router;
