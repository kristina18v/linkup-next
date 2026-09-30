import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";
import { protect } from "@/lib/auth";
import { saveImage } from "@/lib/uploadImages";
import qs from "qs";

// GET /api/courses
export async function GET(request) {
  try {
    const user = await protect(request);

    if (!user) {
      return Response.json(
        { message: "Не сте најавени" },
        { status: 401 }
      );
    }

    // Ги земаме query параметрите од URL
    const queryObj = qs.parse(
      request.nextUrl.searchParams.toString()
    );

    // Која страница ја бараме
    const page = Math.max(
      1,
      parseInt(queryObj.page) || 1
    );

    // Колку курсеви по страница
    const limit = Math.max(
      1,
      parseInt(queryObj.limit) || 10
    );

    // Ги бришеме бидејќи page и limit  не се полиња од Course
    delete queryObj.page;
    delete queryObj.limit;

    // Колку курсеви да прескокнеме
    const skip = (page - 1) * limit;

    let queryString = JSON.stringify(queryObj);

    queryString = queryString.replace(
      /"(gte|gt|lte|lt)"/g,
      (match, operator) => `"$${operator}"`
    );

    const filters = JSON.parse(queryString);

    await connectDB();

    const totalCourses = await Course.countDocuments(filters);
    const totalPages = Math.ceil(totalCourses / limit);

    const courses = await Course.find(filters)
      .populate("instructor", "name surname role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return Response.json(
      {
        courses,
        page,
        totalPages,
      },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
// POST /api/courses
export async function POST(request) {
  try {
    const user = await protect(request);

    if (!user) {
      return Response.json(
        { message: "Не сте најавени" },
        { status: 401 }
      );
    }

    // Само mentor, organization или admin може да креира курс
    if (
      user.role !== "mentor" &&
      user.role !== "organization" &&
      user.role !== "admin"
    ) {
      return Response.json(
        {
          message:
            "Само ментор, организација или админ може да креира курс",
        },
        { status: 403 }
      );
    }

    // Проверуваме дали податоците се испратени како FormData
    if (
      !request.headers
        .get("content-type")
        ?.startsWith("multipart/form-data")
    ) {
      return Response.json(
        { message: "Користи Body > form-data" },
        { status: 400 }
      );
    }

    // Ги земаме податоците испратени од frontend
    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const level = formData.get("level");
    const format = formData.get("format");
    const location = formData.get("location");
    const price = formData.get("price");
    const duration = formData.get("duration");
    const maxStudents = formData.get("maxStudents");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");
    const language = formData.get("language");
    const certificateAvailable =
      formData.get("certificateAvailable");

    const coverImageFile = formData.get("coverImage");

    // Проверка на задолжителни полиња
    if (
      !title ||
      !description ||
      !category ||
      !level ||
      !format ||
      price === null ||
      !duration
    ) {
      return Response.json(
        {
          message:
            "Сите задолжителни полиња мора да бидат пополнети",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Ја зачувуваме сликата
    const coverImage = await saveImage(coverImageFile);

    // Креираме курс
    const newCourse = await Course.create({
      title,
      description,
      category,
      level,
      format,
      location,

      price: Number(price),

      duration,

      maxStudents: maxStudents
        ? Number(maxStudents)
        : undefined,

      startDate: startDate
        ? new Date(startDate)
        : undefined,

      endDate: endDate
        ? new Date(endDate)
        : undefined,

      coverImage,

      language: language || "Македонски",

      certificateAvailable:
        certificateAvailable === "true",

      instructor: user._id,
    });

    // Го земаме курсот повторно за да го populate-неме instructor
    const populatedCourse = await Course.findById(
      newCourse._id
    ).populate(
      "instructor",
      "name surname role profileImage"
    );

    return Response.json(
      populatedCourse,
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: error.status || 500 }
    );
  }
}