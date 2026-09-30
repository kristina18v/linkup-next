import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { protect } from "@/lib/auth";

// GET /api/users/:id

export async function GET(request, { params }) {
  try {
    const currentUser = await protect(request);

    if (!currentUser) {
      return Response.json(
        { message: "Не сте најавени" },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;

    const user = await User.findById(id).select(
      "-password -resetPasswordToken -resetPasswordTokenExpires"
    );

    if (!user) {
      return Response.json(
        { message: "Корисникот не е пронајден" },
        { status: 404 }
      );
    }

    return Response.json(
      { user },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}