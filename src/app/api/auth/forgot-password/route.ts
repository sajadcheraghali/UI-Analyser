// src/app/api/auth/forgot-password/route.ts
import crypto from "crypto";
import nodemailer from "nodemailer";
import { getDatabaseConnection } from "../../../lib/database";
import { User } from "../../../entities/User";

export async function POST(req: Request) {
  try {
    // خواندن و بررسی Body
    const text = await req.text();
    if (!text) {
      return new Response(JSON.stringify({ message: "Empty request body" }), { status: 400 });
    }

    let body: any;
    try {
      body = JSON.parse(text);
    } catch (err) {
      return new Response(JSON.stringify({ message: "Invalid JSON" }), { status: 400 });
    }

    const { email } = body;
    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required" }), { status: 400 });
    }

    // اتصال به دیتابیس
    const connection = await getDatabaseConnection();
    const user = await connection.getRepository(User).findOne({
      where: { email },
    });

    // پاسخ مشابه برای امنیت
    if (!user) {
      return Response.json({ message: "If the email exists, a reset link has been sent" });
    }

    // تولید توکن و ذخیره
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 ساعت بعد

    user.resetToken = resetToken;
    user.resetTokenExp = resetTokenExp.toISOString(); // اگر نوع فیلد string باشه
    await connection.getRepository(User).save(user);

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

    // تنظیم ارسال ایمیل
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // App password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    return Response.json({ message: "If the email exists, a reset link has been sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
