import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { protect } from "@/lib/auth";

// GET http://localhost:3000/api/users
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

    const users = await User.find().select("-password");

    return Response.json(users, { status: 200 });

  } catch (error) {
    return Response.json(
      { error: "Неуспешно вчитување на корисниците" },
      { status: 500 }
    );
  }
}