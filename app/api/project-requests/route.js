import connectDB from "@/lib/mongodb";
import ProjectRequest from "@/models/ProjectRequest";
import { protect } from "@/lib/auth";

// GET /api/project-requests
export async function GET() {
  try {
    await connectDB();

    const projectRequests = await ProjectRequest.find()
      .populate("owner", "name surname role profileImage");

    return Response.json(projectRequests, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// POST /api/project-requests
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

    const {
      title,
      description,
      category,
      projectType,
      skills,
      budget,
      deadline,
    } = await request.json();

    if (
      !title ||
      !description ||
      !category ||
      !projectType ||
      !skills ||
      !deadline
    ) {
      return Response.json(
        { message: "Сите задолжителни полиња мора да бидат пополнети" },
        { status: 400 }
      );
    }

    const newProjectRequest = await ProjectRequest.create({
      title,
      description,
      category,
      projectType,
      skills,
      budget,
      deadline,
      owner: user._id,
    });

    return Response.json(
      newProjectRequest,
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}