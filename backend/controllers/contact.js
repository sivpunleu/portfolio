const contactServices = require("../services/contact");

const submitMessage = async (req, res, next) => {
  try {
    const data = await contactServices.submitContactMessage(req.body);
    return res.status(201).json({
      success: true,
      message: "Thank you! Your message has been sent successfully.",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const data = await contactServices.getAllContactMessages(req.query);
    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const getMessageById = async (req, res, next) => {
  try {
    const data = await contactServices.getContactMessageById(req.params.id);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const rawIsRead = req.body?.is_read;
    const isRead =
      rawIsRead === undefined
        ? true
        : rawIsRead === true ||
          rawIsRead === "true" ||
          rawIsRead === 1 ||
          rawIsRead === "1";
    const data = await contactServices.markContactMessageAsRead(
      req.params.id,
      isRead,
    );
    return res.status(200).json({
      success: true,
      message: isRead ? "Message marked as read" : "Message marked as unread",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    await contactServices.deleteContactMessage(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  submitMessage,
  getMessages,
  getMessageById,
  markAsRead,
  deleteMessage,
};
