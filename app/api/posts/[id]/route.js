import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { protect } from "@/lib/auth";
import { saveImage } from "@/lib/uploadImages";

// GET /api/posts/[id]
export async function GET(request, { params }) {
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

    const post = await Post.findById(id)
      .populate("author", "name surname role profileImage");

    if (!post) {
      return Response.json(
        { message: "Објавата не е пронајдена" },
        { status: 404 }
      );
    }

    return Response.json(post, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// PUT /api/posts/[id]
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

    // Само авторот или admin може да менува
    if (
      post.author.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const content = formData.get("content");
    const type = formData.get("type");
    const tags = formData.getAll("tags");

    if (content !== null) {
      post.content = content;
    }

    if (type !== null) {
      post.type = type;
    }

    if (tags.length > 0) {
      post.tags = tags;
    }

    // Нови слики
    const imageFiles = formData.getAll("images");

    if (imageFiles.length > 0) {
      const images = [];

      for (const file of imageFiles) {
        const filename = await saveImage(file);

        if (filename) {
          images.push(filename);
        }
      }

      post.images = images;
    }

    await post.save();

    const updatedPost = await Post.findById(id)
      .populate("author", "name surname role profileImage");

    return Response.json(updatedPost, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: error.status || 500 }
    );
  }
}


// DELETE /api/posts/[id]
export async function DELETE(request, { params }) {
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

    // Само авторот или admin може да брише
    if (
      post.author.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    await Post.findByIdAndDelete(id);

    return Response.json(
      { message: "Објавата е успешно избришана" },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}