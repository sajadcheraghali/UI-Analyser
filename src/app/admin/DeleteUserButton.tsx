"use client";

import { useState, useTransition } from "react";

export default function DeleteUserButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const [deleted, setDeleted] = useState(false);

  const deleteUser = async () => {
    const response = await fetch("/api/allusers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      setDeleted(true);
    }
  };

  if (deleted) return <span className="text-gray-400">حذف شد</span>;

  return (
    <button
      onClick={() => startTransition(deleteUser)}
      disabled={isPending}
      className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
    >
      {isPending ? "در حال حذف..." : "حذف"}
    </button>
  );
}
