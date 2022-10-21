import express from 'express';
import { body } from 'express-validator'
import { admin, create, save, addImg, storageImg, edit, saveChanges, remove } from '../controllers/propertyController.js';
import protectRoute from '../middleware/protectRoute.js';
import upload from '../middleware/uploadImage.js';

const router = express.Router();

router.get('/myproperties', protectRoute, admin)
router.get('/properties/create', protectRoute, create)
router.post('/properties/create',
    protectRoute,
    body('title').notEmpty().withMessage("Title is required"),
    body('description').notEmpty().withMessage("Description is required"),
    body('category').notEmpty().withMessage("Category is required"),
    body('price').notEmpty().withMessage("Price is required"),
    body('rooms').notEmpty().withMessage("Rooms is required"),
    body('parking').notEmpty().withMessage("Parking is required"),
    body('bathrooms').notEmpty().withMessage("Bathrooms is required"),
    body('street').notEmpty().withMessage("Location is required"),
    save
)

router.get("/properties/addimg/:id", protectRoute, addImg)
router.post("/properties/addimg/:id", protectRoute, upload.single("image"), storageImg)

router.get("/properties/edit/:id", protectRoute, edit)
router.post("/properties/edit/:id", protectRoute,
    body('title').notEmpty().withMessage("Title is required"),
    body('description').notEmpty().withMessage("Description is required"),
    body('category').notEmpty().withMessage("Category is required"),
    body('price').notEmpty().withMessage("Price is required"),
    body('rooms').notEmpty().withMessage("Rooms is required"),
    body('parking').notEmpty().withMessage("Parking is required"),
    body('bathrooms').notEmpty().withMessage("Bathrooms is required"),
    body('street').notEmpty().withMessage("Location is required"),
    saveChanges
)

router.post('/properties/delete/:id', protectRoute, remove)

// Public Area

export default router;
