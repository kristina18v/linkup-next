import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";
import { protect } from "@/lib/auth";
import { saveImage } from "@/lib/uploadImages";

// GET /api/courses/[id]
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const course = await Course.findById(id)
      .populate("instructor", "name surname role");

    if (!course) {
      return Response.json(
        { message: "Курсот не е пронајден" },
        { status: 404 }
      );
    }

    return Response.json(course, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// PUT /api/courses/[id]
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
    const course = await Course.findById(id);

    if (!course) {
      return Response.json(
        { message: "Курсот не е пронајден" },
        { status: 404 }
      );
    }

    // Само instructor или admin може да менува
    if (
      course.instructor.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const fields = [
      "title",
      "description",
      "category",
      "level",
      "format",
      "location",
      "price",
      "duration",
      "maxStudents",
      "startDate",
      "endDate",
      "language",
      "status",
    ];

    for (const field of fields) {
      const value = formData.get(field);

      if (value !== null) {
        course[field] = value;
      }
    }

    const certificateAvailable =
      formData.get("certificateAvailable");

    if (certificateAvailable !== null) {
      course.certificateAvailable =
        certificateAvailable === "true";
    }

    const coverImage = formData.get("coverImage");

    if (coverImage && coverImage.size > 0) {
      course.coverImage = await saveImage(coverImage);
    }

    await course.save();

    return Response.json(course, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: error.status || 500 }
    );
  }
}


// DELETE /api/courses/[id]
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
    const course = await Course.findById(id);

    if (!course) {
      return Response.json(
        { message: "Курсот не е пронајден" },
        { status: 404 }
      );
    }

    // Само instructor или admin може да брише
    if (
      course.instructor.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    await Course.findByIdAndDelete(id);

    return Response.json(
      { message: "Курсот е успешно избришан" },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}