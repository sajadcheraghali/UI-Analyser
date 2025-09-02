import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDatabaseConnection } from "@/app/lib/database";
import { User } from "@/app/entities/User";
import { MoreThan } from "typeorm";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    const connection = await getDatabaseConnection();
    const userRepository = connection.getRepository(User);

    const user = await userRepository.findOne({
      where: {
        resetToken: token,
        resetTokenExp: MoreThan(new Date()),
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExp = null;

    await userRepository.save(user);

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
