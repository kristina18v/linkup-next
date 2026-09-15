import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import { protect } from "@/lib/auth";

// GET /api/messages/[userId]
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

    const { userId } = await params;

    const messages = await Message.find({
      $or: [
        {
          sender: user._id,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: user._id,
        },
      ],
    })
      .populate(
        "sender",
        "name surname profileImage"
      )
      .populate(
        "receiver",
        "name surname profileImage"
      )
      .sort({ createdAt: 1 });

    return Response.json(
      messages,
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}