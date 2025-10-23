"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/auth-form";
import { useEffect } from "react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  return <AuthForm />;
}
