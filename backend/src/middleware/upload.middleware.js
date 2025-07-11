// multer middleware for handling file uploads

import multer from 'multer';

// Set up storage engine for multer
const storage = multer.memoryStorage(); // Use memory storage for simplicity

// Define file filter to allow only images
const fileFilter = (req, file, cb) => {
    // Check if the file is an image
    if (!file.mimetype.startsWith('image/')) {
        cb(null, true); 
    }
    else {
        cb(new Error('Only image files are allowed!'), false);
    }
};
    // Accept images only

// Initialize multer with the storage engine
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10 // Limit file size to 10MB
    }
});


export default upload;