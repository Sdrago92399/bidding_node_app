const Notification = require('../models/Notification'); // Assuming you have a Notification model

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({ where: { userId: req.user.id } });
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fetching notifications failed' });
    }
};

exports.markNotificationsAsRead = async (req, res) => {
    try {
        await Notification.update({ read: true }, { where: { userId: req.user.id, read: false } });
        res.json({ message: 'Notifications marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Marking notifications as read failed' });
    }
};
