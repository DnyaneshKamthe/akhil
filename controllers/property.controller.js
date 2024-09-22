// controllers/PropertyController.js
const Property = require('../models/property.model');



// Function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
      const cldUploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'uploads',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
  
      streamifier.createReadStream(buffer).pipe(cldUploadStream);
    });
  };

exports.addProperty = async (req, res) => {
    try {
        const uploadedImages = [];    
        // Check if files were uploaded
        if (req.files && req.files.length > 0) {
          // Store each file locally
          req.files.forEach(file => {
            // Store the file path of the uploaded image
            uploadedImages.push(`/uploads/${file.filename}`);
          });
        }
    
        // Create a new property object
        const property = new Property({
          ...req.body,
          images: uploadedImages
        });
    
        // Save the property to the database
        await property.save();
        res.status(201).json(property);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    
};

exports.getProperties = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get current page from query, default to 1
        const limit = parseInt(req.query.limit) || 10; // Get results per page, default to 10

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Property.countDocuments().exec();

        const properties = await Property.find()
            .skip(startIndex)
            .limit(limit)
            .exec();

        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit: limit,
            };
        }

        res.json({
            data: properties,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            pagination
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.editProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(property);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        await Property.findByIdAndRemove(req.params.id);
        res.json({ message: 'Property deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// controllers/PropertyController.js (updated searchProperties method)
exports.searchProperties = async (req, res) => {
    try {
        const query = req.query;
        let filter = {};

        if (query.name) filter.name = { $regex: query.name, $options: 'i' };
        if (query.location) filter.location = { $regex: query.location, $options: 'i' };
        if (query.price) {
            const [minPrice, maxPrice] = query.price.split(',');
            filter.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
        }
        if (query.type) filter.type = query.type;

        const properties = await Property.find(filter).exec();
        res.json(properties);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};