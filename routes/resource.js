const express = require('express');
const upload = require('../middlewares/multer');
const { uploadResource, getAllResources } = require('../controllers/resource');
const uploadOnCloudinary = require('../util/cloudinary');
const { deleteResource } = require('../controllers/resource');

const router = express.Router();

router.post("/resource", upload.single('pdf'), uploadOnCloudinary, uploadResource)
router.get("/all-resources/:userId", getAllResources);
router.delete("/delete-resource/:resourceId", deleteResource)

module.exports = router;