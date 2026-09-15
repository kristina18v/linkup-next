import connectDB from "@/lib/mongodb";
import Tutoring from "@/models/Tutoring";
import { protect } from "@/lib/auth";
import { saveImage } from "@/lib/uploadImages";


// GET /api/tutoring
export async function GET() {
  try {
    await connectDB();

    const tutoring = await Tutoring.find()
      .populate(
        "mentor",
        "name surname role profileImage"
      )
      .sort({ createdAt: -1 });

    return Response.json(
      tutoring,
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// POST /api/tutoring
export async function POST(request) {
  try {
    const user = await protect(request);

    if (!user) {
      return Response.json(
        { message: "Не сте најавени" },
        { status: 401 }
      );
    }


    // Само mentor или admin може да креира tutoring
    if (
      user.role !== "mentor" &&
      user.role !== "admin"
    ) {
      return Response.json(
        {
          message:
            "Само ментор или админ може да креира туторинг",
        },
        { status: 403 }
      );
    }


    // Проверка дали frontend испраќа FormData
    if (
      !request.headers
        .get("content-type")
        ?.startsWith("multipart/form-data")
    ) {
      return Response.json(
        {
          message: "Користи Body > form-data",
        },
        { status: 400 }
      );
    }


    // GET FORM DATA
    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const subject = formData.get("subject");
    const price = formData.get("price");
    const format = formData.get("format");
    const location = formData.get("location");

    const availableDatesValue =
      formData.get("availableDates");

    const maxParticipants =
      formData.get("maxParticipants");

    const imageFile =
      formData.get("image");


    // Проверка на задолжителни полиња
    if (
      !title ||
      !description ||
      !subject ||
      price === null ||
      !format ||
      !maxParticipants
    ) {
      return Response.json(
        {
          message:
            "Сите задолжителни полиња мора да бидат пополнети",
        },
        { status: 400 }
      );
    }


    // availableDates од JSON string во array
    let availableDates = [];

    if (availableDatesValue) {
      availableDates = JSON.parse(
        availableDatesValue
      );
    }


    if (availableDates.length === 0) {
      return Response.json(
        {
          message:
            "Мора да додадете најмалку еден достапен датум",
        },
        { status: 400 }
      );
    }


    await connectDB();


    // Зачувување на сликата
    const image = await saveImage(imageFile);


    // CREATE TUTORING
    const newTutoring = await Tutoring.create({
      title,
      description,
      subject,

      price: Number(price),

      format,

      location: location || "",

      availableDates,

      maxParticipants:
        Number(maxParticipants),

      mentor: user._id,

      image,
    });


    // POPULATE MENTOR
    const populatedTutoring =
      await Tutoring.findById(
        newTutoring._id
      ).populate(
        "mentor",
        "name surname role profileImage"
      );


    return Response.json(
      populatedTutoring,
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: error.status || 500 }
    );
  }
}