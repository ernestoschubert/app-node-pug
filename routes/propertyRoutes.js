import express from 'express';
import { body } from 'express-validator'
import { admin, create, save, remove } from '../controllers/propertyController.js';
import protectRoute from '../middleware/protectRoute.js';

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

router.delete('/properties/:id', remove)

export default router;
