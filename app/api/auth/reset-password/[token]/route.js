import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";

// PATCH /api/auth/reset-password/:token

export async function PATCH(request, { params }) {
  try {
    // 1. Го земаме token-от од URL
    const { token } = await params;

    // 2. Ги земаме новите лозинки од body
    const { password, confirmPassword } = await request.json();

    // 3. Проверка дали се внесени
    if (!password || !confirmPassword) {
      return Response.json(
        { message: "Внесете ги двете лозинки" },
        { status: 400 }
      );
    }

    // 4. Проверка дали лозинките се исти
    if (password !== confirmPassword) {
      return Response.json(
        { message: "Лозинките не се совпаѓаат" },
        { status: 400 }
      );
    }

    await connectDB();

    // 5. Го хешираме token-от од URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 6. Бараме корисник со тој token и проверуваме дали token-от не е истечен
      const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpires: { $gt: Date.now() },
      }).select("+resetPasswordToken +resetPasswordTokenExpires");

    if (!user) {
      return Response.json(
        { message: "Token-от е невалиден или истечен" },
        { status: 400 }
      );
    }

    // 7. Ја поставуваме новата лозинка
    user.password = password;

    // 8. Ги бришеме token-от и expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;

    // 9. Зачувуваме
    await user.save();

    return Response.json(
      { message: "Лозинката е успешно променета" },
      { status: 200 }
    );

  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: 500 }
    );
  }
}