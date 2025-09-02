import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth/option"; // مسیر صحیح authOptions را تنظیم کن
import { AppDataSource } from "../../../lib/database";
import { User } from "../../../entities/User";

interface CustomUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as CustomUser;

  if (!session || user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { userId } = body;

  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(User);
  await userRepository.delete(userId);

  return new Response("Deleted", { status: 200 });
}
