const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Item = sequelize.define('Item', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    startingPrice: { type: DataTypes.DECIMAL, allowNull: false },
    currentPrice: { type: DataTypes.DECIMAL, defaultValue: this.startingPrice },
    imageUrl: { type: DataTypes.STRING },
    endTime: { type: DataTypes.DATE, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ownerId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Users', //WASN'T MENTIONED IN THE PDF BUT WAS NECCESARY AP PER THE API
            key: 'id',
        }
    }
});

module.exports = Item;
