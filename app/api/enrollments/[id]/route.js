import connectDB from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import Notification from "@/models/Notification";
import { protect } from "@/lib/auth";

// GET /api/enrollments/[id]
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

    const enrollment = await Enrollment.findById(id)
      .populate("user", "name surname email role")
      .populate("course", "title category level price duration");

    if (!enrollment) {
      return Response.json(
        { message: "Запишувањето не е пронајдено" },
        { status: 404 }
      );
    }

    return Response.json(enrollment, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// PUT /api/enrollments/[id]
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

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return Response.json(
        { message: "Запишувањето не е пронајдено" },
        { status: 404 }
      );
    }

    const course = await Course.findById(enrollment.course);

    if (
      course.instructor.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    const { status } = await request.json();

    const allowedStatuses = [
      "pending",
      "enrolled",
      "rejected",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return Response.json(
        { message: "Невалиден статус" },
        { status: 400 }
      );
    }

    enrollment.status = status;

    enrollment.completedAt =
      status === "completed" ? new Date() : null;

    await enrollment.save();

    // Notification кога е прифатен или одбиен
    if (status === "enrolled" || status === "rejected") {
      await Notification.create({
        user: enrollment.user,
        sender: user._id,
        type: "course",
        message:
          status === "enrolled"
            ? `Вашето барање за курсот "${course.title}" е прифатено.`
            : `Вашето барање за курсот "${course.title}" е одбиено.`,
        link: "/enrollments",
      });
    }

    return Response.json(
      enrollment,
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// DELETE /api/enrollments/[id]
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

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return Response.json(
        { message: "Запишувањето не е пронајдено" },
        { status: 404 }
      );
    }

    if (
      enrollment.user.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    await enrollment.deleteOne();

    return Response.json(
      { message: "Запишувањето е успешно избришано" },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}