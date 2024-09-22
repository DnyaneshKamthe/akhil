// routes/properties.js
const express = require('express');
const router = express.Router();
const PropertyController = require('../controllers/property.controller');
const checkAuth = require("../middlewares/checkAuth")
const multer = require('multer');
const path = require('path')
const fs = require('fs')


// Configure multer for local file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadsDirectory = path.join(__dirname, 'uploads');
  
      // Create uploads folder if it doesn't exist
      if (!fs.existsSync(uploadsDirectory)) {
        fs.mkdirSync(uploadsDirectory);
      }
  
      cb(null, uploadsDirectory); // Store files in the "uploads" folder
    },
    filename: (req, file, cb) => {
      // Create a unique filename to avoid conflicts
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});
  
const upload = multer({ storage });
  

router.post('/',checkAuth, upload.array('images'), PropertyController.addProperty);
router.get('/', checkAuth,PropertyController.getProperties);
router.put('/:id',checkAuth, PropertyController.editProperty);
router.delete('/:id', checkAuth, PropertyController.deleteProperty);
router.get('/search', checkAuth, PropertyController.searchProperties);

module.exports = router;