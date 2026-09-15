import connectDB from "@/lib/mongodb";
import ProjectApplication from "@/models/ProjectApplication";
import ProjectRequest from "@/models/ProjectRequest";
import Notification from "@/models/Notification";
import { protect } from "@/lib/auth";

// GET /api/project-applications/[id]
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

    const application = await ProjectApplication.findById(id)
      .populate("applicant", "name surname email role profileImage")
      .populate(
        "projectRequest",
        "title description owner status"
      );

    if (!application) {
      return Response.json(
        { message: "Апликацијата не е пронајдена" },
        { status: 404 }
      );
    }

    return Response.json(application, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// PUT /api/project-applications/[id]
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

    const application =
      await ProjectApplication.findById(id);

    if (!application) {
      return Response.json(
        { message: "Апликацијата не е пронајдена" },
        { status: 404 }
      );
    }

    const projectRequest =
      await ProjectRequest.findById(
        application.projectRequest
      );

    if (!projectRequest) {
      return Response.json(
        { message: "Проектното барање не е пронајдено" },
        { status: 404 }
      );
    }

    // Само owner на проектот или admin
    if (
      projectRequest.owner.toString() !==
        user._id.toString() &&
      user.role !== "admin"
    ) {
      return Response.json(
        { message: "Немате дозвола" },
        { status: 403 }
      );
    }

    const { status } = await request.json();

    if (!["accepted", "rejected"].includes(status)) {
      return Response.json(
        {
          message:
            "Статусот мора да биде accepted или rejected",
        },
        { status: 400 }
      );
    }

    application.status = status;
    await application.save();

    // Notification до корисникот што аплицирал
    await Notification.create({
      user: application.applicant,
      sender: user._id,
      type: "project",
      message:
        status === "accepted"
          ? `Твојата апликација за проектот "${projectRequest.title}" е прифатена.`
          : `Твојата апликација за проектот "${projectRequest.title}" е одбиена.`,
      link: "/project-applications",
    });

    const updatedApplication =
      await ProjectApplication.findById(id)
        .populate(
          "applicant",
          "name surname email role profileImage"
        )
        .populate(
          "projectRequest",
          "title description owner status"
        );

    return Response.json(
      updatedApplication,
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}