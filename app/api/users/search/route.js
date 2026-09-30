import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { protect } from "@/lib/auth";

// GET /api/users/search?q=kristina

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

    const { searchParams } = new URL(request.url);
    // ja zemam q od urlot 

    const q = searchParams.get("q");
    //„Нема внесено ништо за пребарување → немој да пребаруваш во MongoDB → врати 0 резултати.“
    if (!q) {
      return Response.json([], { status: 200 });
    }

    const users = await User.find({
      _id: { $ne: user._id },

      $or: [
        {
          name: {
            $regex: q,
            $options: "i",
          },
        },
        {
          surname: {
            $regex: q,
            $options: "i",
          },
        },
      ],
    }).select(
      "name surname role profileImage"
    );

    return Response.json(users, {
      status: 200,
    });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}