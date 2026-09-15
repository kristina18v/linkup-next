import { protect } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

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

    const currentUser = await User.findById(user._id)
      .select("-password")
      .populate(
        "followers",
        "name surname profileImage role"
      )
      .populate(
        "following",
        "name surname profileImage role"
      );

    if (!currentUser) {
      return Response.json(
        { message: "Корисникот не е пронајден" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        user: currentUser,
      },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}