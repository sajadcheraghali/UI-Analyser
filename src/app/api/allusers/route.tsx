// src/app/api/users/route.ts
import { NextResponse , NextRequest } from "next/server";
import { AppDataSource } from "../../lib/database";
import { User } from "../../entities/User";

// اطمینان از اتصال به دیتابیس
async function getDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}

// GET: لیست همه کاربران
export async function GET() {
  const dataSource = await getDataSource();
  const userRepo = dataSource.getRepository(User);

  const users = await userRepo.find();
  return NextResponse.json(users);
}

// PATCH: تغییر نقش کاربر
export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, role } = data;

    if (!userId || !role) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const userRepo = dataSource.getRepository(User);

    const user = await userRepo.findOneBy({ id: userId });
    if (!user) {
      return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
    }

    user.role = role;
    await userRepo.save(user);

    return NextResponse.json(user);
  } catch (error) {
    console.error("خطا در PATCH:", error);
    return NextResponse.json({ error: "خطا در سرور" }, { status: 500 });
  }
}
// DELETE: حذف کاربر
export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId } = data;

    if (!userId) {
      return NextResponse.json({ error: "شناسه کاربر ارسال نشده" }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const userRepo = dataSource.getRepository(User);

    const user = await userRepo.findOneBy({ id: userId });
    if (!user) {
      return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
    }

    await userRepo.remove(user);

    return NextResponse.json({ message: "کاربر با موفقیت حذف شد" });
  } catch (error) {
    console.error("خطا در DELETE:", error);
    return NextResponse.json({ error: "خطا در سرور" }, { status: 500 });
  }
}