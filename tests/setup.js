process.env.NODE_ENV = 'test';
process.env.SECRET_KEY = 'your_secret_key';
process.env.EMAIL = 'your_test_email@gmail.com';
process.env.EMAIL_PASSWORD = 'your_email_password';

const sequelize = require('../config/config');
const User = require('../models/User');
const Item = require('../models/Item');
const Bid = require('../models/Bid');
const fs = require('fs');
const path = require('path');
require('../server');

const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

before(async () => {
    await sequelize.sync();
});

after(async () => {
    await sequelize.close();
});
