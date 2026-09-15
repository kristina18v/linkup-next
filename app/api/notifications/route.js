import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { protect } from "@/lib/auth";

// GET /api/notifications
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

    const notifications = await Notification.find({
      user: user._id,
    })
      .sort({ createdAt: -1 })
      .populate(
        "sender",
        "name surname profileImage"
      );

    return Response.json(
      notifications,
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}