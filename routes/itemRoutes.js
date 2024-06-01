const express = require('express');
const { body } = require('express-validator');
const {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
} = require('../controllers/itemController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const upload = require('../middleware/uploadMiddleware'); // For handling image uploads
const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', 
    verifyToken, 
    upload.single('image'), 
    createItem
);
router.put('/:id', 
    verifyToken, 
    validate([
        body('name').optional().notEmpty().withMessage('Name is required'),
        body('description').optional().notEmpty().withMessage('Description is required'),
        body('currentPrice').optional().isFloat({ gt: 0 }).withMessage('Current price must be a positive number'),
        body('status').optional().notEmpty().withMessage('Status is required')
    ]), 
    updateItem
);
router.delete('/:id', verifyToken, deleteItem);

module.exports = router;
