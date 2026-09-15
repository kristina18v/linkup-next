import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Корисникот кој ја прима нотификацијата
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Корисникот кој ја предизвикал нотификацијата
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "follow",
        "share",
        "message",
        "course",
        "project",
        "internship",
        "application",
        "review",
        "general",
      ],
      default: "general",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    link: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;