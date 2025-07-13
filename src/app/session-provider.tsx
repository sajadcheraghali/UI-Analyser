// src/app/session-provider.jsx
"use client";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  session?: Session | null;
}

export default function CustomSessionProvider({ children, session } : Props ) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
