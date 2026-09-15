import connectDB from "@/lib/mongodb";
import Tutoring from "@/models/Tutoring";
import { protect } from "@/lib/auth";

// GET
export async function GET(_, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const tutoring = await Tutoring.findById(id)
      .populate("mentor", "name surname role");

    if (!tutoring) {
      return Response.json(
        { message: "Туторингот не е пронајден" },
        { status: 404 }
      );
    }

    return Response.json(tutoring, { status: 200 });

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
    const tutoring = await Tutoring.findById(id);

    if (!tutoring) {
      return Response.json(
        { message: "Туторингот не е пронајден" },
        { status: 404 }
      );
    }

    if (
      tutoring.mentor.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    const data = await request.json();

    const updatedTutoring = await Tutoring.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    return Response.json(updatedTutoring, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
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
    const tutoring = await Tutoring.findById(id);

    if (!tutoring) {
      return Response.json(
        { message: "Туторингот не е пронајден" },
        { status: 404 }
      );
    }

    if (
      tutoring.mentor.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    await tutoring.deleteOne();

    return Response.json(
      { message: "Туторингот е успешно избришан" },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}