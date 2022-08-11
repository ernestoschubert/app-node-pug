import express from 'express';
import { admin, createForm, remove } from '../controllers/propertyController.js';

const router = express.Router();

router.get('/myproperties', admin)
router.get('/properties/create', createForm)

router.delete('/properties/:id', remove)

export default router;
