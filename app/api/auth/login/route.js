// POST /api/auth/login
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { createToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Проверуваме дали се испратени email и password
    if (!email || !password) {
      return NextResponse.json(
        { message: "Емаил и лозинка се задолжителни" },
        { status: 400 }
      );
    }

    await connectDB();

    // 2. Проверуваме дали корисникот постои
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return NextResponse.json(
        { message: "Невалиден емаил или лозинка" },
        { status: 401 }
      );
    }

    // 3. Ја споредуваме внесената лозинка
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Невалиден емаил или лозинка" },
        { status: 401 }
      );
    }

    // 4. Креираме JWT token
    const token = createToken(user._id.toString());

    const response = NextResponse.json(
      {
        status: "success",
        data: {
          user: {
            id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role,
          },
        },
      },
      { status: 200 }
    );

    // 5. Го зачувуваме token-от во cookie
    response.cookies.set("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 24 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}