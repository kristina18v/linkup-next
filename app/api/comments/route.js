import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import { protect } from "@/lib/auth";

// GET /api/comments?postId=...
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return Response.json(
        { message: "ID на објавата е задолжително" },
        { status: 400 }
      );
    }

    const comments = await Comment.find({
      post: postId,
    })
      .sort({ createdAt: 1 })
      .populate("author", "name surname role profileImage");

    return Response.json(comments, {
      status: 200,
    });

  } catch (error) {
    console.log("GET COMMENTS ERROR:", error);

    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// POST /api/comments
export async function POST(request) {
  try {
    const user = await protect(request);

    if (!user) {
      return Response.json(
        { message: "Не сте најавени" },
        { status: 401 }
      );
    }

    await connectDB();

    const { post, content } = await request.json();

    if (!post || !content) {
      return Response.json(
        {
          message:
            "Објавата и содржината на коментарот се задолжителни",
        },
        { status: 400 }
      );
    }

    const existingPost = await Post.findById(post);

    if (!existingPost) {
      return Response.json(
        { message: "Објавата не е пронајдена" },
        { status: 404 }
      );
    }

    const newComment = await Comment.create({
      post,
      author: user._id,
      content,
    });

    const populatedComment = await Comment.findById(
      newComment._id
    ).populate("author", "name surname role profileImage");

    return Response.json(populatedComment, {
      status: 201,
    });

  } catch (error) {
    console.log("CREATE COMMENT ERROR:", error);

    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
