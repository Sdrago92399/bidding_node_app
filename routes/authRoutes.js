const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, requestPasswordReset, resetPassword } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const router = express.Router();

router.post('/register', 
    validate([
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ]), 
    register
);

router.post('/login', 
    validate([
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ]), 
    login
);

router.get('/profile', verifyToken, getProfile);

router.post('/request-password-reset', 
    validate([
        body('email').isEmail().withMessage('Valid email is required')
    ]), 
    requestPasswordReset
);

router.post('/reset-password', 
    validate([
        body('token').notEmpty().withMessage('Token is required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
    ]), 
    resetPassword
);

module.exports = router;
