import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import sendEmail from "@/lib/sendEmail";
import crypto from "crypto";
// POST / api/auth/api
export async function POST(request) {
  try {
    const { email } = await request.json();

    // 1. Проверка дали е внесен email
    if (!email) {
      return Response.json(
        { message: "Внесете email адреса" },
        { status: 400 }
      );
    }

    // 2. Поврзување со база
    await connectDB();

    // 3. Најди корисник според email
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // За безбедност, не кажуваме дали email-от постои или не
    if (!user) {
      return Response.json(
        {
          message:
            "Ако постои корисник со овој email, ќе добиете линк за промена на лозинката.",
        },
        { status: 200 }
      );
    }

    // 4. Креирај случаен token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 5. Hash на token-от пред да се зачува во база
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 6. Зачувај го token-от и времето до кога важи
    user.resetPasswordToken = hashedToken;

    user.resetPasswordTokenExpires =
      Date.now() + 15 * 60 * 1000; // 15 минути

    await user.save({validateBeforeSave: false});

    // 7. Линк што ќе го добие корисникот на email
     const origin = new URL(request.url).origin;

     const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    // 8. Испрати email
   await sendEmail({
     options: {
    to: user.email,
    subject: "Промена на лозинка",
    text: `Кликнете на овој линк за да ја промените лозинката: ${resetUrl}`,
    html: `
      <h2>Промена на лозинка</h2>
      <p>Кликнете на линкот подолу за да поставите нова лозинка:</p>

      <a href="${resetUrl}">
        Промени лозинка
      </a>

      <p>Линкот важи 15 минути.</p>
    `,
  },
});

    return Response.json(
      {
        message:
          "Ако постои корисник со овој email, ќе добиете линк за промена на лозинката.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}