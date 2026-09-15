import connectDB from "@/lib/mongodb";
import ProjectRequest from "@/models/ProjectRequest";
import { protect } from "@/lib/auth";

// GET /api/project-requests/my-requests
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

    const myRequests = await ProjectRequest.find({
      owner: user._id,
    })
      .sort({ createdAt: -1 })
      .populate(
        "owner",
        "name surname role profileImage"
      );

    return Response.json(
      myRequests,
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}