import express from 'express';
import { body } from 'express-validator';
import protectRoute from '../middleware/protectRoute.js';
import upload from '../middleware/uploadImage.js';
import {
    admin,
    create,
    save,
    addImg,
    storageImg,
    edit,
    saveChanges,
    remove,
    viewProperty,
    sendMessage,
    viewMessages
} from '../controllers/propertyController.js';
import identifyUser from '../middleware/identifyUser.js';

const router = express.Router();

// Protected routes

router.get('/myproperties', protectRoute, admin);
router.get('/properties/create', protectRoute, create);
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
);

router.get("/properties/addimg/:id", protectRoute, addImg);
router.post("/properties/addimg/:id", protectRoute, upload.single("image"), storageImg);

router.get("/properties/edit/:id", protectRoute, edit);
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
);

router.post('/properties/delete/:id', protectRoute, remove);

// Public Area
router.get('/property/:id',
    identifyUser,
    viewProperty
);

// storage the messages

router.post('/property/:id',
    identifyUser,
    body('message').isLength({ min: 10 }).withMessage('The message cannot be empty or have less than 10 letters.'),
    sendMessage,
);

router.get('/messages/:id',
    protectRoute,
    viewMessages
)
export default router;
