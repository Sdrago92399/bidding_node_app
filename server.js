const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/config');
const userRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const bidRoutes = require('./routes/bidRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const http = require('http');
const { errorHandler } = require('./middleware/errorMiddleware');
const { createBidSocket } = require('./controllers/bidController');
const apiLimiter = require('./middleware/rateLimiter');
const logger = require('./middleware/logger');
const socketController = require('./controllers/socketController');

dotenv.config();

const app = express();
app.use(express.json());
app.use(logger);
app.use(apiLimiter);

const server = http.createServer(app);
const io = require('socket.io')(server);
socketController.setIo(io);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('bid', async (data) => {
        const { itemId, userId, bidAmount } = data;
        const bid = await createBidSocket(itemId, userId, bidAmount);
        if (bid) {
            io.emit('update', bid);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
app.use('/users', userRoutes);
app.use('/items', itemRoutes);
app.use('/', bidRoutes);
app.use('/notifications', notificationRoutes);

app.use(errorHandler);

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${server.address().port}`);
    sequelize.sync()
        .then(() => {
            console.log('Database synchronized');
        })
        .catch(err => {
            console.error('Error synchronizing database:', err);
        });
});

module.exports = server;
