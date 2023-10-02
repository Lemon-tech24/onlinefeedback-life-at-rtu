"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    try {
      if (status === "authenticated") {
        router.push("/home");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [status]);

  return (
    <main className="flex w-full h-screen flex-col items-center justify-center p-4">
      <div className="w-full h-full flex items-center justify-center m-auto animate-fadeAway">
        <button onClick={() => signIn("google", { callbackUrl: "/home" })}>
          Login with RTU ACCOUNT
        </button>
      </div>
    </main>
  );
}
