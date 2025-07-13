// src/app/lib/database.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Account } from "../entities/Account";
import { Session } from "../entities/Session";
import { Evaluation } from "../entities/Evaluation"; // اضافه کردن Evaluation
import bcrypt from "bcryptjs";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: true, // برای دیباگ فعال است
  entities: [User, Account, Session, Evaluation],
});

let dataSourcePromise: Promise<DataSource> | null = null;

export async function getDatabaseConnection(): Promise<DataSource> {
  if (AppDataSource.isInitialized) {
    console.log("✅ Using existing database connection");
    return AppDataSource;
  }

  if (!dataSourcePromise) {
    console.log("🚀 Initializing database connection...");
    dataSourcePromise = AppDataSource.initialize()
      .then(async (dataSource) => {
        console.log("✅ Database connected successfully");
        await createDefaultAdmin();
        return dataSource;
      })
      .catch((err) => {
        console.error("❌ Database initialization failed:", err);
        dataSourcePromise = null;
        throw err;
      });
  }

  return dataSourcePromise;
}

async function createDefaultAdmin() {
  const userRepository = AppDataSource.getRepository(User);

  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@gmail.com";
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";

  const existingAdmin = await userRepository.findOne({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const Admin = userRepository.create({
      email: adminEmail,
      name: "Admin",
      password: hashedPassword,
      role: "admin",
    });

    await userRepository.save(Admin);
    console.log("🚀 Default admin user created:", adminEmail);
  } else {
    console.log("ℹ️ Admin user already exists:", adminEmail);
  }
}