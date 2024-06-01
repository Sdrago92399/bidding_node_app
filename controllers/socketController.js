const Bid = require('../models/Bid');
const Item = require('../models/Item');
const Notification = require('../models/Notification');

let io;

exports.setIo = (ioInstance) => {
    io = ioInstance;
};

exports.getIo = () => io;

exports.createBidCommon = async (itemId, userId, bidAmount) => {
    const item = await Item.findByPk(itemId);
    if (!item) {
        throw new Error('Item not found');
    }
    if (bidAmount <= item.currentPrice) {
        throw new Error('Bid amount must be higher than current price');
    }
    const bid = await Bid.create({ itemId, userId, bidAmount });
    item.currentPrice = bidAmount;
    await item.save();

    await Notification.create({
        userId: item.ownerId,
        message: `A new bid of ${bidAmount} has been placed on your item "${item.name}".`,
        read: false
    });

    return bid;
};