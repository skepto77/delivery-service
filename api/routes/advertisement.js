import express from 'express';
const router = express.Router({ mergeParams: true });
import {
  getAdvertisements,
  addAdvertisement,
  getAdvertisementById,
  removeAdvertisementById,
} from '../controllers/advertisement.js';
import uploadFile from '../middleware/uploadFile.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

router.route('/').get(getAdvertisements).post(isAuthenticated, uploadFile, addAdvertisement);
router.route('/:id').get(getAdvertisementById).delete(isAuthenticated, removeAdvertisementById);

export default router;
