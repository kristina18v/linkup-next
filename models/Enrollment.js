import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    // Корисникот кој се запишува на курсот
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Курсот на кој се запишува
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // Зошто сака да се запише
    motivation: {
      type: String,
      trim: true,
      default: "",
    },

    // Статус на запишувањето
    status: {
      type: String,
      enum: [
        "pending",
        "enrolled",
        "rejected",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    // Кога е запишан
    enrolledAt: {
      type: Date,
      default: null,
    },

    // Кога го завршил курсот
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Еден корисник не може двапати да се запише
// на истиот курс
enrollmentSchema.index(
  { user: 1, course: 1 },
  { unique: true }
);

const Enrollment = mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;