import connectDB from "@/lib/mongodb";
import Tutoring from "@/models/Tutoring";
import { protect } from "@/lib/auth";

// PUT /api/tutoring/[id]/join
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
    const tutoring = await Tutoring.findById(id);

    if (!tutoring) {
      return Response.json(
        { message: "Туторингот не е пронајден" },
        { status: 404 }
      );
    }

    const alreadyJoined = tutoring.participants.some(
      (participant) =>
        participant.toString() === user._id.toString()
    );

    // Ако е веќе запишан -> отпиши го
    if (alreadyJoined) {
      tutoring.participants = tutoring.participants.filter(
        (participant) =>
          participant.toString() !== user._id.toString()
      );
    }

    // Ако не е запишан -> запиши го
    else {
      if (
        tutoring.participants.length >=
        tutoring.maxParticipants
      ) {
        return Response.json(
          { message: "Нема слободни места" },
          { status: 400 }
        );
      }

      tutoring.participants.push(user._id);
    }

    await tutoring.save();

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