import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import sendEmail from "@/lib/sendEmail";
import { welcomeEmailTemplate } from "@/lib/emailTemplates";

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

console.log("Ќе испратам welcome email до:", newUser.email);

await sendEmail({
  options: {
    to: newUser.email,
    subject: "Добредојдовте на LinkUp Next",
    text: `Здраво ${newUser.name}, успешно се регистриравте на LinkUp Next.`,
    html: welcomeEmailTemplate({ name: newUser.name }),
  },
});

console.log("Welcome email е испратен");

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