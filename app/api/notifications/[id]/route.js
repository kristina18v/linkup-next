import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { protect } from "@/lib/auth";

// PUT - mark as read/unread
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
    const notification = await Notification.findById(id);

    if (!notification) {
      return Response.json(
        { message: "Известувањето не е пронајдено" },
        { status: 404 }
      );
    }

    if (notification.user.toString() !== user._id.toString()) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    const { isRead } = await request.json();

    if (typeof isRead !== "boolean") {
      return Response.json(
        { message: "isRead мора да биде true или false" },
        { status: 400 }
      );
    }

    notification.isRead = isRead;
    await notification.save();

    return Response.json(notification, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// DELETE - delete notification
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
    const notification = await Notification.findById(id);

    if (!notification) {
      return Response.json(
        { message: "Известувањето не е пронајдено" },
        { status: 404 }
      );
    }

    if (notification.user.toString() !== user._id.toString()) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    await notification.deleteOne();

    return Response.json(
      { message: "Известувањето е успешно избришано" },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}