import { protect } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { saveImage } from "@/lib/uploadImages";
import Post from "@/models/Post";

// GET /api/posts
export async function GET(request) {
  try {
    const user = await protect(request);

    if (!user) {
      return Response.json(
        { message: "Не сте најавени" },
        { status: 401 }
      );
    }

    await connectDB();

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "name surname role profileImage");

    return Response.json(posts, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// POST /api/posts
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

    const formData = await request.formData();

    const content = formData.get("content");
    const type = formData.get("type") || "general";
    const tags = formData.getAll("tags");

    if (!content) {
      return Response.json(
        { message: "Содржината е задолжителна" },
        { status: 400 }
      );
    }

    // Зачувување на сликите
    const imageFiles = formData.getAll("images");
    const images = [];

    for (const file of imageFiles) {
      const filename = await saveImage(file);

      if (filename) {
        images.push(filename);
      }
    }

    // Креирање на пост
    const newPost = await Post.create({
      author: user._id,
      content,
      type,
      tags,
      images,
    });

    const populatedPost = await Post.findById(
      newPost._id
    ).populate(
      "author",
      "name surname role profileImage"
    );

    return Response.json(
      populatedPost,
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: error.status || 500 }
    );
  }
}