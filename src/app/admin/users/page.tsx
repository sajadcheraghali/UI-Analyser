"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import DeleteUserButton from "../DeleteUserButton";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }

    if (status === "authenticated" && session.user.role !== "admin") {
      redirect("/");
    }

    const loadUsers = async () => {
      try {
        const response = await fetch("/api/allusers");
        if (!response.ok) {
          throw new Error("خطا در دریافت کاربران");
        }
        const userList = await response.json();
        setUsers(userList);
      } catch (error) {
        console.error("خطا در بارگذاری کاربران:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [status, session]);

  const toggleUserRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      const response = await fetch("/api/allusers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) {
        throw new Error("خطا در به‌روزرسانی نقش کاربر");
      }

      const updatedUser = await response.json();
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
    } catch (error) {
      console.error("خطا در به‌روزرسانی نقش کاربر:", error);
    }
  };

  if (loading || status !== "authenticated") {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">مدیریت کاربران</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">شناسه</th>
              <th className="py-2 px-4 border">نام</th>
              <th className="py-2 px-4 border">ایمیل</th>
              <th className="py-2 px-4 border">نقش</th>
              <th className="py-2 px-4 border">حذف کاربر</th>
              <th className="py-2 px-4 border">تغییر نقش کاربر</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border">{user.id}</td>
                <td className="py-2 px-4 border">{user.name}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">{user.role}</td>
                {user.email !== "admin@gmail.com" &&
                <td className="py-2 px-4 border">
                  <DeleteUserButton userId={user.id}/>
                </td>}
                <td className="py-2 px-4 border">
                  {user.email !== "admin@gmail.com" &&
                    user.email !== process.env.DEFAULT_ADMIN_EMAIL && (
                      <button
                        onClick={() => toggleUserRole(user.id, user.role)}
                        className={`px-3 py-1 rounded ${
                          user.role === "admin"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-blue-500 hover:bg-blue-600"
                        } text-white`}
                      >
                        {user.role === "admin" ? "تبدیل به کاربر" : "تبدیل به ادمین"}
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}