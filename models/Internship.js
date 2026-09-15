import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
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

    organization: {
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
        "business",
        "data-analysis",
        "other",
      ],
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    format: {
      type: String,
      enum: ["remote", "hybrid", "onsite"],
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    requirements: {
      type: String,
      trim: true,
      default: "",
    },

    // Дали праксата е платена
    paid: {
      type: Boolean,
      default: false,
    },

    // Надомест, ако е платена
    compensation: {
      type: Number,
      min: 0,
      default: 0,
    },

    // Кога започнува праксата
    startDate: {
      type: Date,
    },

    // До кога може да се аплицира
    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
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

const Internship = mongoose.models.Internship || mongoose.model("Internship", internshipSchema);

export default Internship;