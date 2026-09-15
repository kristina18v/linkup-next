import connectDB from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import Notification from "@/models/Notification";
import { protect } from "@/lib/auth";

// GET /api/enrollments
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

    let enrollments;

    // Mentor ги гледа запишувањата за своите курсеви
    if (user.role === "mentor") {
      const courses = await Course.find({
        instructor: user._id,
      }).select("_id");

      const courseIds = courses.map(
        (course) => course._id
      );

      enrollments = await Enrollment.find({
        course: { $in: courseIds },
      });
    }

    // Admin ги гледа сите
    else if (user.role === "admin") {
      enrollments = await Enrollment.find();
    }

    // Другите корисници ги гледаат своите
    else {
      enrollments = await Enrollment.find({
        user: user._id,
      });
    }

    await Enrollment.populate(enrollments, [
      {
        path: "user",
        select: "name surname email role",
      },
      {
        path: "course",
        select: "title category level price duration instructor",
      },
    ]);

    return Response.json(
      enrollments,
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// POST /api/enrollments
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

    const { course, motivation } =
      await request.json();

    if (!course) {
      return Response.json(
        { message: "Курсот е задолжителен" },
        { status: 400 }
      );
    }

    const existingCourse =
      await Course.findById(course);

    if (!existingCourse) {
      return Response.json(
        { message: "Курсот не е пронајден" },
        { status: 404 }
      );
    }

    // Проверува дали веќе е запишан/аплицирал
    const existingEnrollment =
      await Enrollment.findOne({
        user: user._id,
        course,
      });

    if (existingEnrollment) {
      return Response.json(
        { message: "Веќе имате испратено барање за овој курс" },
        { status: 400 }
      );
    }

    const newEnrollment =
      await Enrollment.create({
        user: user._id,
        course,
        motivation,
        status: "pending",
      });

    // Notification до instructor
    if (
      existingCourse.instructor.toString() !==
      user._id.toString()
    ) {
      await Notification.create({
        user: existingCourse.instructor,
        sender: user._id,
        type: "course",
        message: `${user.name} испрати барање за запишување на курсот "${existingCourse.title}".`,
        link: "/enrollments",
      });
    }

    return Response.json(
      newEnrollment,
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}