import { NextResponse } from "next/server";
import { getDatabaseConnection } from "@/app/lib/database";
import { User } from "../../entities/User";
import { Equal } from "typeorm";

export async function GET() {
  try {
    const dataSource = await getDatabaseConnection();
    const userRepo = dataSource.getRepository(User);
    const users = await userRepo.find();
    return NextResponse.json(users);
  } catch (error) {
    console.error("خطا در دریافت کاربران:", error);
    return NextResponse.json({ error: "خطا در دریافت کاربران" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId, role } = await request.json();
    const dataSource = await getDatabaseConnection();
    const userRepo = dataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: Equal(userId) } });

    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    if (process.env.DEFAULT_ADMIN_EMAIL && user.email === process.env.DEFAULT_ADMIN_EMAIL) {
      return NextResponse.json({ error: "نمی‌توان ادمین پیش‌فرض را تغییر داد" }, { status: 403 });
    }

    user.role = role;
    await userRepo.save(user);
    return NextResponse.json(user);
  } catch (error) {
    console.error("خطا در به‌روزرسانی نقش کاربر:", error);
    return NextResponse.json({ error: "خطا در به‌روزرسانی نقش کاربر" }, { status: 500 });
  }
}