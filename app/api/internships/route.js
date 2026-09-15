import connectDB from "@/lib/mongodb";
import Internship from "@/models/Internship";
import { protect } from "@/lib/auth";

// GET /api/internships
export async function GET() {
  try {
    await connectDB();

    const internships = await Internship.find()
      .populate("organization", "name surname role");

    return Response.json(internships, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// POST /api/internships
export async function POST(request) {
  try {
    const user = await protect(request);

    if (!user) {
      return Response.json(
        { message: "Не сте најавени" },
        { status: 401 }
      );
    }

    if (
      user.role !== "organization" &&
      user.role !== "admin"
    ) {
      return Response.json(
        { message: "Немате дозвола да креирате пракса" },
        { status: 403 }
      );
    }

    await connectDB();

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
    } = await request.json();

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !format ||
      !duration ||
      !deadline
    ) {
      return Response.json(
        { message: "Сите задолжителни полиња мора да бидат пополнети" },
        { status: 400 }
      );
    }

    const newInternship = await Internship.create({
      title,
      description,
      category,
      location,
      format,
      duration,
      skills,
      requirements,
      deadline,
      organization: user._id,
    });

    return Response.json(newInternship, { status: 201 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}