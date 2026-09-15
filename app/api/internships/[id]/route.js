import connectDB from "@/lib/mongodb";
import Internship from "@/models/Internship";
import { protect } from "@/lib/auth";

// GET
export async function GET(_, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const internship = await Internship.findById(id)
      .populate("organization", "name surname role");

    if (!internship) {
      return Response.json(
        { message: "Праксата не е пронајдена" },
        { status: 404 }
      );
    }

    return Response.json(internship, { status: 200 });

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
    const internship = await Internship.findById(id);

    if (!internship) {
      return Response.json(
        { message: "Праксата не е пронајдена" },
        { status: 404 }
      );
    }

    if (
      internship.organization.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    const {
      title,
      description,
      category,
      location,
      format,
      duration,
      skills,
      requirements,
      deadline,
      status,
    } = await request.json();

    const updatedInternship =
      await Internship.findByIdAndUpdate(
        id,
        {
          title,
          description,
          category,
          location,
          format,
          duration,
          skills,
          requirements,
          deadline,
          status,
        },
        { new: true, runValidators: true }
      );

    return Response.json(updatedInternship, { status: 200 });

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
    const internship = await Internship.findById(id);

    if (!internship) {
      return Response.json(
        { message: "Праксата не е пронајдена" },
        { status: 404 }
      );
    }

    if (
      internship.organization.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    await internship.deleteOne();

    return Response.json(
      { message: "Праксата е успешно избришана" },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}