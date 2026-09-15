import mongoose from "mongoose";

const projectRequestSchema = new mongoose.Schema(
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

    category: {
      type: String,
      required: true,
      enum: [
        "web-development",
        "mobile-development",
        "design",
        "databases",
        "data-analysis",
        "other",
      ],
    },

    projectType: {
      type: String,
      required: true,
      enum: [
        "graduation",
        "seminar",
        "personal",
        "school",
        "startup",
        "collaboration",
        "other",
      ],
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    budget: {
      type: Number,
      min: 0,
      default: 0,
    },

    deadline: {
      type: Date,
      required: true,
    },

    // Корисникот кој го објавил проектот
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "open",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

const ProjectRequest =mongoose.models.ProjectRequest || mongoose.model("ProjectRequest", projectRequestSchema);

export default ProjectRequest;