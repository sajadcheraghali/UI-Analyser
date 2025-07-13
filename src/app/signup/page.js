"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import { LogIn, LogOut, UserCircle } from "lucide-react"

export default function Component() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        
        {/* لوگو */}
        <div className="flex justify-center">
          <UserCircle className="h-16 w-16 text-blue-500" />
        </div>

        {/* متن و دکمه‌ها */}
        {session ? (
          <>
            <p className="text-lg font-medium">
              Signed in as{" "}
              <span className="text-blue-600 font-semibold">
                {session.user.email}
              </span>
            </p>
            <button
              onClick={() => signOut()}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition cursor-pointer"
            >
              <LogOut size={20} />
              Sign out
            </button>
          </>
        ) : (
          <>
            <p className="text-lg font-medium">Not signed in</p>
            <button
              onClick={() => signIn()}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition cursor-pointer"
            >
              <LogIn size={20} />
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  )
}
