import mongoose from "mongoose";

const projectApplicationSchema = new mongoose.Schema(
  {
    // Проектот за кој се аплицира
    projectRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectRequest",
      required: true,
    },

    // Корисникот кој аплицира
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Порака до сопственикот на проектот
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Статус на апликацијата
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Ист корисник не може двапати да аплицира
// на истиот проект
projectApplicationSchema.index(
  { projectRequest: 1, applicant: 1 },
  { unique: true }
);

const ProjectApplication =
  mongoose.models.ProjectApplication ||
  mongoose.model(
    "ProjectApplication",
    projectApplicationSchema
  );

export default ProjectApplication;