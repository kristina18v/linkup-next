import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";
import { protect } from "@/lib/auth";
import { saveImage } from "@/lib/uploadImages";

// GET
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


// PUT
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
      "status",
    ];

    for (const field of fields) {
      const value = formData.get(field);

      if (value !== null) {
        course[field] = value;
      }
    }

    const image = formData.get("image");

    if (image && image.size > 0) {
      course.image = await saveImage(image);
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


// DELETE
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