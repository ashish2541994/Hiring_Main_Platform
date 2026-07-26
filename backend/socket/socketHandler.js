const MessageRepository = require('../repositories/MessageRepository');
const NotificationRepository = require('../repositories/NotificationRepository');

class SocketHandler {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map();
    this.setupSocket();
  }

  setupSocket() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Join user's personal room
      socket.on('join_user', (userId) => {
        socket.userId = userId;
        socket.join(`user_${userId}`);
        this.connectedUsers.set(userId, socket.id);
        
        // Notify others that user is online
        socket.broadcast.emit('user_online', { userId });
      });

      // Join conversation room
      socket.on('join_conversation', (conversationId) => {
        socket.join(`conversation_${conversationId}`);
      });

      // Leave conversation room
      socket.on('leave_conversation', (conversationId) => {
        socket.leave(`conversation_${conversationId}`);
      });

      // Send message
      socket.on('send_message', async (data) => {
        try {
          const { conversationId, message } = data;
          
          // Save message to database
          const savedMessage = await MessageRepository.create({
            conversationId,
            senderId: message.senderId,
            content: message.content,
            read: false,
          });

          // Populate sender info
          const populatedMessage = await MessageRepository.findById(savedMessage._id);

          // Emit to conversation room
          this.io.to(`conversation_${conversationId}`).emit('new_message', {
            conversationId,
            message: populatedMessage,
          });

          // Emit notification to recipient
          const conversation = await this.getConversationParticipants(conversationId);
          conversation.participants.forEach((participant) => {
            if (participant.toString() !== message.senderId.toString()) {
              this.io.to(`user_${participant}`).emit('notification', {
                type: 'new_message',
                conversationId,
                message: populatedMessage,
              });
            }
          });
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Typing indicator
      socket.on('typing', (data) => {
        const { conversationId, isTyping, userId } = data;
        socket.to(`conversation_${conversationId}`).emit('typing', {
          conversationId,
          isTyping,
          userId,
        });
      });

      // Mark messages as read
      socket.on('mark_read', async (data) => {
        try {
          const { conversationId, userId } = data;
          await MessageRepository.markAsRead(conversationId, userId);
          
          // Notify sender that messages were read
          this.io.to(`conversation_${conversationId}`).emit('messages_read', {
            conversationId,
            userId,
          });
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      });

      // Disconnect
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
          this.io.emit('user_offline', { userId: socket.userId });
        }
        console.log('User disconnected:', socket.id);
      });
    });
  }

  async getConversationParticipants(conversationId) {
    // TODO: Implement conversation participants retrieval
    return { participants: [] };
  }

  sendNotificationToUser(userId, notification) {
    this.io.to(`user_${userId}`).emit('notification', notification);
  }

  sendNotificationToUsers(userIds, notification) {
    userIds.forEach((userId) => {
      this.sendNotificationToUser(userId, notification);
    });
  }

  broadcastToConversation(conversationId, event, data) {
    this.io.to(`conversation_${conversationId}`).emit(event, data);
  }

  getConnectedUsers() {
    return Array.from(this.connectedUsers.keys());
  }

  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }
}

module.exports = SocketHandler;
