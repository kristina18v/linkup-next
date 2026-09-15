import mongoose from "mongoose";

const tutoringSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    format: {
      type: String,
      enum: ["online", "physical", "hybrid"],
      required: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    availableDates: [
      {
        type: Date,
      },
    ],

    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Tutoring =
  mongoose.models.Tutoring ||
  mongoose.model("Tutoring", tutoringSchema);

export default Tutoring;