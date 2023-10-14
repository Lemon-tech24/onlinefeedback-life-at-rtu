"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { VscLoading } from "react-icons/vsc";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      return;
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      if (status === "loading") {
        return;
      }

      if (session?.user) {
        router.push("/home");
      }
    };

    checkSession();
  }, [session, status, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {status === "loading" ? (
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl text-blue-800 animate-spin">
            <VscLoading />
          </div>
          <div>Loading</div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/home" })}
        >
          Login With RTU
        </button>
      )}
    </main>
  );
}
