import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

   
    content: {
      type: String,
      required: true,
      trim: true,
    },

    
    type: {
      type: String,
      enum: [
        "general",
        "project-help",
        "mentoring",
        "course-promo",
        "internship",
        "study-group",
      ],
      default: "general",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

  
    images: {
      type: [String],
      default: [],
    },

    // Корисници кои ја лајкнале објавата
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Ако ова е споделена објава
    sharedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Post =
  mongoose.models.Post ||
  mongoose.model("Post", postSchema);

export default Post;