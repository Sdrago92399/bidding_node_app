const express = require('express');
const { body } = require('express-validator');
const { createBid, getBids } = require('../controllers/bidController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const router = express.Router();

router.get('/items/:itemId/bids', getBids);
router.post('/items/:itemId/bids', 
    verifyToken, 
    validate([
        body('bidAmount').isFloat({ gt: 0 }).withMessage('Bid amount must be a positive number')
    ]), 
    createBid
);

module.exports = router;
