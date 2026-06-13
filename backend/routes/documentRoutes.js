import express from 'express';
import {
    uploadDocument,
    getDocuments,
    getDocument,
    updateDocument,
    deleteDocument,
} from '../controllers/documentController.js';
import { protect } from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();
//all routes are protected
router.post('/', protect, upload.single('file'), uploadDocument);
router.get('/', protect, getDocuments);
router.get('/:id', protect, getDocument);
router.put('/:id', protect, upload.single('file'), updateDocument);
router.delete('/:id', protect, deleteDocument); 
export default router;
        