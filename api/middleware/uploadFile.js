import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes('jpg')) {
    cb(null, true);
  } else {
    cb(new Error('Only images! (*.jpg)'));
  }
};

let upload = multer({ storage: storage, fileFilter });

export default upload.single('BookFile'); // !single
