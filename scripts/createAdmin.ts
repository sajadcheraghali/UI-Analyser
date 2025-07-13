import { AppDataSource } from "../src/app/lib/database";
import { User } from "../src/app/entities/User";
import bcrypt from "bcrypt"; // اکنون با نصب @types/bcrypt، این import بدون خطا خواهد بود
import readline from "readline";

async function createAdmin(email: string, password: string) {
  // این تابع یک ادمین جدید در پایگاه داده ایجاد می کند
  await AppDataSource.initialize(); // اتصال به پایگاه داده را آغاز می کند

  try {
    // هش کردن رمز عبور برای امنیت بیشتر
    const hashedPassword = await bcrypt.hash(password, 10);

    // گرفتن Repository برای موجودیت User
    const userRepository = AppDataSource.getRepository(User);

    // ایجاد یک نمونه جدید از User
    const user = new User();
    user.email = email;
    user.name = "Admin"; // نام می تواند ثابت یا ورودی باشد
    user.password = hashedPassword;
    user.role = "admin";

    // ذخیره کاربر در پایگاه داده با استفاده از Repository
    await userRepository.save(user);

    console.log("Admin created successfully!");
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    // بستن اتصال به پایگاه داده پس از اتمام عملیات
    await AppDataSource.destroy();
  }
}

// این قسمت ورودی کاربر را از طریق کنسول دریافت می‌کند
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("ایمیل ادمین را وارد کنید: ", (email) => {
  rl.question("پسورد ادمین را وارد کنید: ", (password) => {
    // فراخوانی تابع createAdmin و مدیریت خطاهای احتمالی
    createAdmin(email, password).catch(console.error);
    rl.close(); // بستن رابط readline پس از دریافت ورودی ها
  });
});

// برای اجرای این اسکریپت، از دستور زیر در ترمینال استفاده کنید:
// ts-node مسیر_فایل/createAdmin.ts
// (اگر ts-node نصب شده باشد)
// یا ابتدا کامپایل کرده و سپس با node اجرا کنید:
// tsc مسیر_فایل/createAdmin.ts
// node مسیر_فایل/createAdmin.js


// node مسیر_فایل/createAdmin.js