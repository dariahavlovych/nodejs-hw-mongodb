import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const suffix = Date.now();
    cb(null, `${suffix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
