import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import { protect } from "@/lib/auth";

// PUT /api/posts/[id]/save
export async function PUT(request, { params }) {
  try {
    const user = await protect(request);

    if (!user) {
      return Response.json(
        { message: "Не сте најавени" },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;

    const post = await Post.findById(id);

    if (!post) {
      return Response.json(
        { message: "Објавата не е пронајдена" },
        { status: 404 }
      );
    }

    const currentUser = await User.findById(user._id);

    const alreadySaved = currentUser.savedPosts.some(
      (postId) => postId.toString() === id
    );

    if (alreadySaved) {
      currentUser.savedPosts = currentUser.savedPosts.filter(
        (postId) => postId.toString() !== id
      );
    } else {
      currentUser.savedPosts.push(id);
    }

    await currentUser.save();

    return Response.json(
      { saved: !alreadySaved },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}