import express from "express";
import { init, category, notFound, searcher } from "../controllers/appController.js";

const router = express.Router()

// init page

router.get('/', init)

// categories

router.get('/categories/:id', category)

// page 404

router.get('/404', notFound)

// searcher

router.post('/search', searcher)

export default router;