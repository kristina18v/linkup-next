import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Името е задолжително поле"],
      trim: true,
    },

    surname: {
      type: String,
      required: [true, "Презимето е задолжително поле"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Емаил е задолжително поле"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Лозинката е задолжително поле"],
      minlength: [8, "Лозинката мора да има најмалку 8 карактери"],
    },

    age: {
      type: Number,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    location: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    interests: [
      {
        type: String,
      },
    ],

    role: {
      type: String,
      enum: ["member", "mentor", "organization", "admin"],
      default: "member",
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordTokenExpires: {
      type: Date,
      select: false,
    },

    savedPosts: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;