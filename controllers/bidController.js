const Bid = require('../models/Bid');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const { getIo, createBidCommon } = require("./socketController");

exports.getBids = async (req, res) => {
    try {
        const bids = await Bid.findAll({ where: { itemId: req.params.itemId } });
        res.json(bids);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fetching bids failed' });
    }
};

exports.createBid = async (req, res) => {
    const { bidAmount } = req.body;
    try {
        const bid = await createBidCommon(req.params.itemId, req.user.id, bidAmount);
        getIo().emit('update', bid);
        res.status(201).json(bid);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};
