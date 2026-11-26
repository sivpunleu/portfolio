const contactModels = require("../models/contact");
const mailservices = require("./mailservices");
const { createHttpError } = require("../utils/errors");

const submitContactMessage = async (body) => {
  const payload = {
    sender_name: body.sender_name.trim(),
    sender_email: body.sender_email.trim(),
    subject: body.subject.trim(),
    message: body.message.trim(),
  };

  const insertId = await contactModels.create(payload);
  const createdMessage = await contactModels.getById(insertId);

  // Non-blocking notification to admin email
  mailservices
    .sendContactNotificationEmail(payload)
    .catch((err) => {
      console.error("Failed to send contact notification email:", err.message);
    });

  return {
    id: createdMessage.id,
    sender_name: createdMessage.sender_name,
    subject: createdMessage.subject,
    created_at: createdMessage.created_at,
  };
};

const getAllContactMessages = async (query = {}) => {
  const unreadOnly = query.unread === "true" || query.unread === true;
  return await contactModels.getAll({
    unreadOnly,
    limit: query.limit,
  });
};

const getContactMessageById = async (id) => {
  const message = await contactModels.getById(id);
  if (!message) {
    throw createHttpError("Message not found", 404);
  }
  return message;
};

const markContactMessageAsRead = async (id, isRead = true) => {
  await getContactMessageById(id);
  await contactModels.markAsRead(id, isRead);
  return await contactModels.getById(id);
};

const deleteContactMessage = async (id) => {
  await getContactMessageById(id);
  await contactModels.remove(id);
  return { id: Number(id) };
};

module.exports = {
  submitContactMessage,
  getAllContactMessages,
  getContactMessageById,
  markContactMessageAsRead,
  deleteContactMessage,
};
