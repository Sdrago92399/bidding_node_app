const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./User');
const Item = require('./Item');

const Bid = sequelize.define('Bid', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    itemId: { type: DataTypes.INTEGER, references: { model: Item, key: 'id' } },
    userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
    bidAmount: { type: DataTypes.DECIMAL, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Bid;
