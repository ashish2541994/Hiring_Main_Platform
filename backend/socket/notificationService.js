const { getIO } = require('./index');
const NotificationRepository = require('../repositories/NotificationRepository');

class NotificationService {
  async createNotification(userId, notificationData) {
    try {
      const notification = await NotificationRepository.create({
        userId,
        ...notificationData,
        read: false,
      });

      // Send real-time notification via socket
      const io = getIO();
      io.to(`user_${userId}`).emit('notification', notification);

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async createBulkNotifications(userIds, notificationData) {
    try {
      const notifications = userIds.map((userId) => ({
        userId,
        ...notificationData,
        read: false,
      }));

      const createdNotifications = await NotificationRepository.createBulk(notifications);

      // Send real-time notifications via socket
      const io = getIO();
      userIds.forEach((userId, index) => {
        io.to(`user_${userId}`).emit('notification', createdNotifications[index]);
      });

      return createdNotifications;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  async sendJobApplicationNotification(recruiterId, candidateName, jobTitle) {
    return await this.createNotification(recruiterId, {
      type: 'job_application',
      title: 'New Job Application',
      message: `${candidateName} has applied for ${jobTitle}`,
      data: {
        candidateName,
        jobTitle,
      },
    });
  }

  async sendApplicationStatusNotification(candidateId, jobTitle, status) {
    const statusMessages = {
      reviewed: 'Your application has been reviewed',
      interviewed: 'You have been selected for an interview',
      accepted: 'Congratulations! Your application has been accepted',
      rejected: 'Your application was not selected',
    };

    return await this.createNotification(candidateId, {
      type: 'application_status',
      title: 'Application Status Update',
      message: statusMessages[status] || `Your application status is now ${status}`,
      data: {
        jobTitle,
        status,
      },
    });
  }

  async sendNewMessageNotification(userId, senderName, conversationId) {
    return await this.createNotification(userId, {
      type: 'new_message',
      title: 'New Message',
      message: `${senderName} sent you a message`,
      data: {
        senderName,
        conversationId,
      },
    });
  }

  async sendJobPostedNotification(candidateIds, jobTitle, companyName) {
    return await this.createBulkNotifications(candidateIds, {
      type: 'new_job',
      title: 'New Job Posted',
      message: `${companyName} is hiring for ${jobTitle}`,
      data: {
        jobTitle,
        companyName,
      },
    });
  }
}

module.exports = new NotificationService();
