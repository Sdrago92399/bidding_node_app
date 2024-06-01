const Item = require('../models/Item');
const { Op } = require('sequelize');
const moment = require('moment');

exports.getItems = async (req, res) => {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
        where.name = { [Op.like]: `%${search}%` };
    }
    if (status) {
        if (status === 'active') {
            where.endTime = { [Op.gt]: moment().toDate() };
        } else if (status === 'inactive') {
            where.endTime = { [Op.lt]: moment().toDate() };
        }
    }
    
    try {
        const items = await Item.findAndCountAll({ where, limit: parseInt(limit), offset: parseInt(offset) });
        res.json({
            items: items.rows,
            totalItems: items.count,
            totalPages: Math.ceil(items.count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fetching items failed' });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fetching item failed' });
    }
};

exports.updateItem = async (req, res) => {
    const { name, description, startingPrice, endTime } = req.body;
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        if (item.ownerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        await item.update({ name, description, startingPrice: parseFloat(startingPrice), endTime });

        const updatedStatus = moment(endTime).isAfter(moment()) ? 'active' : 'inactive';
        await item.update({ status: updatedStatus });

        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Updating item failed' });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        if (item.ownerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        await item.destroy();
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Deleting item failed' });
    }
};

exports.createItem = async (req, res) => {
    const { name, description, startingPrice, endTime } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    if (req.user.role !== 'admin' && req.user.role !== 'user') {
        return res.status(403).json({ error: 'Access denied' });
    }
    try {
        const item = await Item.create({
            name,
            description,
            startingPrice: parseFloat(startingPrice),
            currentPrice: parseFloat(startingPrice),
            endTime,
            imageUrl,
            ownerId: req.user.id
        });
        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Creating item failed' });
    }
};
