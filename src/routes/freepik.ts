import express from 'express'

import {
  generateImage,
} from '../controllers/freepik.cotroller';

const router = express.Router()

router.post('/generate-image-freepik', generateImage);


export default router;
