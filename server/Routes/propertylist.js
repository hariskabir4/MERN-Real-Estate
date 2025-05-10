const express = require("express");
const router = express.Router();
const Residential = require("../Models/Residential");
const Commercial = require("../Models/Commercial");
const multer = require("multer");
const path = require("path");
const authenticateToken = require("../middleware/jwtAuth");
const fs = require('fs');

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // specify the directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // filename as current timestamp + file extension
    }
});

// Initialize multer with the storage engine
const upload = multer({ storage: storage }).array("images", 5); // Allow multiple file uploads, max 5 images

// Property Listing Route
router.post("/new-listing", authenticateToken, upload, async (req, res) => {
    try {
        // Debug logging
        console.log("Authenticated user in route:", req.user);
        
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token" });
        }

        const { propertyType, title, owner, location, price, size, bedrooms, bathrooms, purpose, features, city, state, status } = req.body;

        // Validation checks
        if (!propertyType || !title || !owner || !location || !price || !size || !purpose) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!["Residential", "Commercial"].includes(propertyType)) {
            return res.status(400).json({ message: "Invalid property type" });
        }

        if (purpose !== "Sell" && purpose !== "Rent") {
            return res.status(400).json({ message: "Purpose must be 'Sell' or 'Rent'" });
        }

        if (propertyType === "Residential" && (!bedrooms || !bathrooms)) {
            return res.status(400).json({ message: "Bedrooms and Bathrooms are required for residential properties" });
        }

        // Handle file uploads (if any)
        const images = req.files ? req.files.map(file => file.filename) : [];

        let property;
        if (propertyType === "Residential") {
            property = new Residential({
                userId,
                title: title.trim(),
                owner: owner.trim(),
                location: location.trim(),
                price,
                size,
                bedrooms,
                bathrooms,
                purpose,
                features: features?.trim(),
                city,
                state,
                status,
                images, // Save the image filenames in the db
            });
        } else {
            property = new Commercial({
                userId,
                title: title.trim(),
                owner: owner.trim(),
                location: location.trim(),
                price,
                size,
                purpose,
                features: features?.trim(),
                city,
                state,
                status,
                images, // Save the image filenames in the db
            });
        }

        await property.save();
        res.status(201).json({ message: "Property listed successfully", property });
    } catch (error) {
        console.error("Property listing error:", error);
        res.status(500).json({ 
            message: "Error creating property listing",
            error: error.message 
        });
    }
});

// Get user's listings
router.get("/my-listings", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find properties in both collections
    const residentialProperties = await Residential.find({ userId: userId });
    const commercialProperties = await Commercial.find({ userId: userId });
    
    // Combine and format the properties
    const allProperties = [...residentialProperties, ...commercialProperties].map(property => ({
      _id: property._id.toString(),
      type: property.title,
      location: property.location,
      price: property.price,
      size: property.size,
      date: property.listedAt,
      // Keep the original imageSrc format that was working before
      imageSrc: property.images && property.images.length > 0 
        ? `/uploads/${property.images[0]}` // Adjust this path according to your server setup
        : null,
      // Include any other fields that were working before
      owner: property.owner,
      features: property.features,
      city: property.city,
      state: property.state,
      status: property.status
    }));

    console.log('Sending properties:', allProperties); // Debug log
    res.json(allProperties);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: "Error fetching listings" });
  }
});

// Update route with correct multer configuration
router.put("/update/:id", upload, async (req, res) => {
  try {
    const propertyId = req.params.id;
    const updates = req.body;
    const newImages = req.files;

    let property = await Residential.findById(propertyId);
    let isResidential = true;

    if (!property) {
      property = await Commercial.findById(propertyId);
      isResidential = false;
    }

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (req.body.removedImages) {
      const removedImages = JSON.parse(req.body.removedImages);
      for (const imageName of removedImages) {
        if (imageName) {
          const imagePath = path.join(__dirname, '../uploads', imageName);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      }
      updates.images = [];
    } else if (newImages && newImages.length > 0) {
      updates.images = [newImages[0].filename];
    }

    const updatedProperty = await (isResidential ? Residential : Commercial)
      .findByIdAndUpdate(
        propertyId,
        { $set: updates },
        { new: true }
      );

    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Error updating property' });
  }
});

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log('Property Route Request:', {
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query
  });
  next();
});

// Add this console log to verify route registration
console.log('Registering property routes...');

router.get('/property/:id', async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Try to find in Residential collection
    let property = await Residential.findById(propertyId);
    let isResidential = true;

    // If not in Residential, try Commercial
    if (!property) {
      property = await Commercial.findById(propertyId);
      isResidential = false;
    }

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const propertyDetails = {
      _id: property._id,
      title: property.title,
      owner: property.owner,
      location: property.location,
      price: property.price,
      size: property.size,
      purpose: property.purpose,
      features: property.features,
      city: property.city,
      state: property.state,
      status: property.status,
      images: property.images,
      ...(isResidential ? {
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
      } : {})
    };

    res.json(propertyDetails);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Error fetching property details' });
  }
});

// Add this test route to verify the router is mounted correctly
router.get('/test', (req, res) => {
  res.json({ message: 'Property routes are working' });
});

// Add this test route at the top of your routes
router.get('/test-auth', authenticateToken, (req, res) => {
  res.json({
    message: 'Authentication working',
    user: req.user
  });
});

// Add this route to expose the propertyId mapping
router.get('/property-id-map', async (req, res) => {
  try {
    const residentials = await Residential.find({});
    const commercials = await Commercial.find({});
    const allProperties = [...residentials, ...commercials];
    const propertyIdMap = {};
    allProperties.forEach((prop, idx) => {
      propertyIdMap[prop._id.toString()] = idx + 1;
    });
    res.json(propertyIdMap);
  } catch (error) {
    res.status(500).json({ message: 'Error building propertyId map', error: error.message });
  }
});

module.exports = router;
