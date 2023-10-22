"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { VscLoading } from "react-icons/vsc";
import { FcGoogle } from "react-icons/fc";

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
    <div
      className="flex min-h-screen w-full flex-col items-center justify-between bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/landingbg.png')" }}
    >
      {status === "loading" ? (
        <div className="flex flex-col fixed top-0 left-0 w-full h-full items-center justify-center">
          <div className="text-7xl text-blue-800 animate-spin">
            <VscLoading />
          </div>
          <div className="text-3xl">Loading</div>
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-between 2xl:flex-wrap 2xl:flex-col 2xl:justify-center 2xl:gap-5">
          <div className="flex items-center w-full flex-col">
            <div className="flex flex-col items-center w-full">
              <p className="text-60 bg-white text-yellow-400 ml-3 w-56 rounded-3xl text-center italic sm:text-5xl">
                LIFE @
              </p>
            </div>
            <p
              className="text-300 font-extrabold leading-relaxed text-left bg-clip-text text-transparent md:text-100 sm:text-200"
              style={{
                lineHeight: "250px",
                backgroundImage: "url('/textbg.png')",
              }}
            >
              RTU
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="tagline text-7xl md:text-5xl sm:text-4xl">
              Your <div className="voice text-slate-600 shadow-none">VOICE</div>
              matters
            </div>

            <div className="text-2xl italic w-full text-center text-slate-700 md:text-xl sm:text-base break-words">
              We make it easier to share your thoughts about the campus
            </div>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/home" })}
              className="flex items-center justify-center gap-1 text-2xl border-2 border-black rounded-3xl p-2"
            >
              <div className="text-4xl">
                <FcGoogle />
              </div>
              Sign In With RTU
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
