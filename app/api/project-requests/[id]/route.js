import connectDB from "@/lib/mongodb";
import ProjectRequest from "@/models/ProjectRequest";
import { protect } from "@/lib/auth";

// GET /api/project-requests/[id]
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const projectRequest = await ProjectRequest.findById(id)
      .populate("owner", "name surname role profileImage");

    if (!projectRequest) {
      return Response.json(
        { message: "Проектното барање не е пронајдено" },
        { status: 404 }
      );
    }

    return Response.json(projectRequest, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// PUT /api/project-requests/[id]
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
    const projectRequest = await ProjectRequest.findById(id);

    if (!projectRequest) {
      return Response.json(
        { message: "Проектното барање не е пронајдено" },
        { status: 404 }
      );
    }

    // Само owner или admin може да менува
    if (
      projectRequest.owner.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    const data = await request.json();

    const updatedProjectRequest =
      await ProjectRequest.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
      );

    return Response.json(
      updatedProjectRequest,
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// DELETE /api/project-requests/[id]
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
    const projectRequest = await ProjectRequest.findById(id);

    if (!projectRequest) {
      return Response.json(
        { message: "Проектното барање не е пронајдено" },
        { status: 404 }
      );
    }

    // Само owner или admin може да брише
    if (
      projectRequest.owner.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    await projectRequest.deleteOne();

    return Response.json(
      { message: "Проектното барање е успешно избришано" },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}