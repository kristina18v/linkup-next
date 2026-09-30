import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { protect } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = await protect(request);

    if (!user) {
      return Response.json(
        { message: "You are not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();

    const myPosts = await Post.find({
      author: user._id,
    })
      .sort({ createdAt: -1 })
      .populate("author", "name surname role profileImage");

    return Response.json(myPosts, {
      status: 200,
    });
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
