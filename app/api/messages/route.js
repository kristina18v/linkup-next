import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import Notification from "@/models/Notification";
import { protect } from "@/lib/auth";

// GET /api/messages
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

    const messages = await Message.find({
      $or: [
        { sender: user._id },
        { receiver: user._id },
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
      .sort({ createdAt: -1 });

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


// POST /api/messages
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

    const { receiver, content } =
      await request.json();

    if (!receiver || !content) {
      return Response.json(
        {
          message:
            "Примачот и пораката се задолжителни",
        },
        { status: 400 }
      );
    }

    // Не може да си прати порака сам на себе
    if (
      receiver.toString() ===
      user._id.toString()
    ) {
      return Response.json(
        {
          message:
            "Не можете да испратите порака сами на себе",
        },
        { status: 400 }
      );
    }

    const newMessage = await Message.create({
      sender: user._id,
      receiver,
      content,
    });

    // Notification до корисникот
    await Notification.create({
      user: receiver,
      sender: user._id,
      type: "message",
      message: `${user.name} ви испрати порака.`,
      link: `/messages/${user._id}`,
    });

    const populatedMessage =
      await Message.findById(newMessage._id)
        .populate(
          "sender",
          "name surname profileImage"
        )
        .populate(
          "receiver",
          "name surname profileImage"
        );

    return Response.json(
      populatedMessage,
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}