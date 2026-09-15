import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import sendEmail from "@/lib/sendEmail";

// POST /api/auth/register
export async function POST(request) {
  try {
    const { name, surname, email, password, age, role } =
      await request.json();

    if (!name || !surname || !email || !password || !age || !role) {
      return Response.json(
        { message: "Сите полиња се задолжителни" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return Response.json(
        { message: "Корисник со овој емаил веќе постои" },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      name,
      surname,
      email: email.toLowerCase().trim(),
      password,
      age,
      role,
    });

  await sendEmail({
  options: {
    to: newUser.email,
    subject: "Успешна регистрација на LinkUp",
    text: `Здраво ${newUser.name}, успешно се регистриравте на LinkUp.`,
    html: `
      <h2>Здраво ${newUser.name}</h2>
      <p>Успешно се регистриравте на LinkUp.</p>
    `,
  },
});

    return Response.json(
      {
        status: "Success",
        data: {
          user: {
            id: newUser._id,
            name: newUser.name,
            surname: newUser.surname,
            email: newUser.email,
            age: newUser.age,
            role: newUser.role,
          },
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: 500 }
    );
  }
}