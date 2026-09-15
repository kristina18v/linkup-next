import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import Notification from "@/models/Notification";
import { protect } from "@/lib/auth";

// PUT /api/posts/[id]/likes
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

    const alreadyLiked = post.likes.some(
      (like) => like.toString() === user._id.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (like) => like.toString() !== user._id.toString()
      );
    } else {
      post.likes.push(user._id);

      if (post.author.toString() !== user._id.toString()) {
        await Notification.create({
          user: post.author,
          sender: user._id,
          type: "like",
          message: `${user.name} ја лајкна вашата објава.`,
          link: `/posts/${post._id}`,
        });
      }
    }

    await post.save();

    const updatedPost = await Post.findById(id)
      .populate(
        "author",
        "name surname role profileImage"
      );

    return Response.json(
      updatedPost,
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}