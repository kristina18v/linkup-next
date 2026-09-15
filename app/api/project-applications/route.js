import connectDB from "@/lib/mongodb";
import ProjectApplication from "@/models/ProjectApplication";
import ProjectRequest from "@/models/ProjectRequest";
import Notification from "@/models/Notification";
import { protect } from "@/lib/auth";

// GET /api/project-applications
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

    // Ги наоѓа моите project requests
    const myRequests = await ProjectRequest.find({
      owner: user._id,
    }).select("_id");

    const requestIds = myRequests.map(
      (request) => request._id
    );

    // Моите апликации + апликации на моите проекти
    const applications = await ProjectApplication.find({
      $or: [
        { applicant: user._id },
        { projectRequest: { $in: requestIds } },
      ],
    })
      .populate(
        "applicant",
        "name surname email role profileImage"
      )
      .populate(
        "projectRequest",
        "title description owner status"
      )
      .sort({ createdAt: -1 });

    return Response.json(
      applications,
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// POST /api/project-applications
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

    const { projectRequest, message } =
      await request.json();

    if (!projectRequest || !message?.trim()) {
      return Response.json(
        { message: "Проектот и пораката се задолжителни" },
        { status: 400 }
      );
    }

    const existingRequest =
      await ProjectRequest.findById(projectRequest);

    if (!existingRequest) {
      return Response.json(
        { message: "Проектното барање не е пронајдено" },
        { status: 404 }
      );
    }

    // Не може да аплицира на свој проект
    if (
      existingRequest.owner.toString() ===
      user._id.toString()
    ) {
      return Response.json(
        { message: "Не можете да аплицирате на свое барање" },
        { status: 400 }
      );
    }

    // Проверува дали веќе аплицирал
    const exists = await ProjectApplication.findOne({
      projectRequest,
      applicant: user._id,
    });

    if (exists) {
      return Response.json(
        { message: "Веќе имате аплицирано" },
        { status: 400 }
      );
    }

    const newApplication =
      await ProjectApplication.create({
        projectRequest,
        applicant: user._id,
        message: message.trim(),
      });

    // Notification до сопственикот на проектот
    await Notification.create({
      user: existingRequest.owner,
      sender: user._id,
      type: "project",
      message: `${user.name} аплицираше на твоето барање "${existingRequest.title}".`,
      link: "/project-applications",
    });

    const populatedApplication =
      await ProjectApplication.findById(
        newApplication._id
      )
        .populate(
          "applicant",
          "name surname email role profileImage"
        )
        .populate(
          "projectRequest",
          "title description owner status"
        );

    return Response.json(
      populatedApplication,
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}