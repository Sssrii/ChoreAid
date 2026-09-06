const connectDB = require('./src/config/db');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const app = require('./app');

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('register', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});