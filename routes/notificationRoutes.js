const express = require('express');
const { getNotifications, markNotificationsAsRead } = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', verifyToken, getNotifications);
router.post('/mark-read', verifyToken, markNotificationsAsRead);

module.exports = router;
