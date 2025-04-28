// Add these event handlers to your existing socket.io setup
io.on('connection', (socket) => {
  // ... your existing socket code ...

  socket.on('userOnline', async (userId) => {
    try {
      // Update user status in database
      await User.findByIdAndUpdate(userId, { isOnline: true });
      // Broadcast to all connected clients
      io.emit('userOnline', userId);
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  });

  socket.on('userOffline', async (userId) => {
    try {
      // Update user status in database
      await User.findByIdAndUpdate(userId, { 
        isOnline: false,
        lastActive: new Date()
      });
      // Broadcast to all connected clients
      io.emit('userOffline', userId);
    } catch (error) {
      console.error('Error updating offline status:', error);
    }
  });

  socket.on('disconnect', () => {
    // Handle any cleanup if needed
    console.log('Client disconnected');
  });
}); 