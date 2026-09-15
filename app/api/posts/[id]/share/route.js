import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { protect } from "@/lib/auth";
import Notification from "@/models/Notification";

// POST /api/posts/[id]/share
export async function POST(request, { params }) {
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

    const originalPost = await Post.findById(id);

    if (!originalPost) {
      return Response.json(
        { message: "Објавата не е пронајдена" },
        { status: 404 }
      );
    }

    const sharedPost = await Post.create({
      author: user._id,
      content: "Споделена објава",
      sharedPost: originalPost._id,
    });

    if (
      originalPost.author.toString() !== user._id.toString()
    ) {
      await Notification.create({
        user: originalPost.author,
        sender: user._id,
        type: "share",
        message: `${user.name} ја сподели вашата објава.`,
        link: `/posts/${sharedPost._id}`,
      });
    }

    return Response.json(
      sharedPost,
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}