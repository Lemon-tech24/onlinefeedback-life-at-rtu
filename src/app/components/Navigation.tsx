"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NavData } from "../types";
import { BsChatLeftQuoteFill } from "react-icons/bs";

function Navigation({ name, setOpen }: NavData) {
  const router = useRouter();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  //open logout overlay
  const [logout, setLogout] = useState<boolean>(false);

  return (
    <div className="flex w-full items-center justify-between px-12 py-6 md:px-3">
      <div className="cursor-default text-3xl font-semibold flex gap-1 first-letter:capitalize xl:text-4xl md:text-3xl">
        Hello,
        {name ? (
          <p className="first-letter:capitalize lowercase">
            {name.split(" ")[0]}
          </p>
        ) : (
          <div className="animate-pulse"> Loading</div>
        )}
      </div>
      <div className="flex items-center gap-5 text-xl font-medium">
        <button
          type="button"
          onClick={() => setOpen()}
          disabled={session ? false : true}
          className="fixed bottom-12 right-20 z-40 rounded-full bg-blue-600 animate-bounce border-2 border-black border-solid md:right-5 md:bottom-6"
        >
          {session ? (
            <div className="text-5xl p-4 flex text-white sm:text-4xl">
              <BsChatLeftQuoteFill />
            </div>
          ) : (
            <div className="animate-pulse text-white p-2">Loading</div>
          )}
        </button>

        <button
          type="button"
          onClick={() => setLogout(true)}
          disabled={session ? false : true}
          className="xl:text-2xl md:text-xl"
        >
          Logout
        </button>
      </div>

      {logout && (
        <div className="fixed top-0 left-0 w-full h-full z-50 bg-slate-500/80 flex items-center justify-center animate-fadeIn">
          <div className="bg-white flex p-10 flex-col rounded-2xl gap-5 md:p-2 md:gap-2">
            <div className="flex items-center justify-center text-2xl w-full md:text-xl">
              Are you sure you want to logout ?
            </div>

            {/* Button container */}
            <div className="w-1/2 flex items-center justify-between m-auto">
              <button
                type="button"
                className="bg-green-700 rounded-xl p-1 text-xl text-white w-1/3 text-center md:text-lg"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Yes
              </button>
              <button
                type="button"
                className="bg-red-700 rounded-xl p-1 text-xl text-white w-1/3 text-center md:text-lg"
                onClick={() => setLogout(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
