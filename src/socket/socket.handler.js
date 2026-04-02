// import jwt from 'jsonwebtoken';
// import User from '../models/User.model.js';

// const socketHandler = (io) => {
//   io.use((socket, next) => {
//     try {
//       const token = socket.handshake.auth.token;
//       if (!token) return next(new Error('Token nahi mila'));

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       socket.userId = decoded.id;
//       next();
//     } catch (error) {
//       next(new Error('Token invalid hai'));
//     }
//   });

//   io.on('connection', async (socket) => {
//     console.log(`User connected: ${socket.userId}`);

//     await User.findByIdAndUpdate(socket.userId, { isActive: true });

//     socket.on('update-location', async (data) => {
//       const { latitude, longitude } = data;

//       await User.findByIdAndUpdate(socket.userId, {
//         lastLocation: { latitude, longitude, updatedAt: new Date() },
//       });

//       io.emit('location-updated', {
//         userId: socket.userId,
//         latitude,
//         longitude,
//         updatedAt: new Date(),
//       });
//     });

//     socket.on('disconnect', async () => {
//       console.log(`User disconnected: ${socket.userId}`);
//       await User.findByIdAndUpdate(socket.userId, { isActive: false });
//     });
//   });
// };

// export default socketHandler;



import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import Location from '../models/Location.model.js';

const socketHandler = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Token nahi mila'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Token invalid hai'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.userId}`);

    await User.findByIdAndUpdate(socket.userId, { isActive: true });

    socket.on('update-location', async (data) => {
      try {
        const { latitude, longitude } = data;

        await User.findByIdAndUpdate(socket.userId, {
          lastLocation: {
            latitude,
            longitude,
            updatedAt: new Date(),
          },
        });

        await Location.create({
          userId: socket.userId,
          latitude,
          longitude,
        });

        io.emit('location-updated', {
          userId: socket.userId,
          latitude,
          longitude,
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error('Location update error:', error.message);
      }
    });

    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);
      await User.findByIdAndUpdate(socket.userId, { isActive: false });
    });
  });
};

export default socketHandler;