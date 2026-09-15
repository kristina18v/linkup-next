import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Насловот е задолжителен"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Описот е задолжителен"],
      trim: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "programming",
        "design",
        "marketing",
        "languages",
        "mathematics",
        "business",
        "other",
      ],
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    format: {
      type: String,
      enum: ["online", "physical"],
      required: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: String,
      required: true,
    },

    maxStudents: {
      type: Number,
      min: 1,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    coverImage: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    enrolledUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    language: {
      type: String,
      default: "Македонски",
    },

    certificateAvailable: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;