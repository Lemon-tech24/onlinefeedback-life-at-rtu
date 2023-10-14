"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NavData } from "../types";

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
    <div className="flex w-full items-center justify-between px-12 py-6">
      <div className="cursor-default text-3xl font-semibold flex first-letter:capitalize">
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
        >
          {session ? "Add Post" : <div className="animate-pulse">Loading</div>}
        </button>

        <button
          type="button"
          onClick={() => setLogout(true)}
          disabled={session ? false : true}
        >
          Logout
        </button>
      </div>

      {logout && (
        <div className="fixed top-0 left-0 w-full h-full bg-slate-500/80 flex items-center justify-center animate-fadeIn">
          <div className="bg-white flex p-10 flex-col rounded-2xl gap-5">
            <div className="flex items-center justify-center text-2xl w-full">
              Are you sure you want to logout ?
            </div>

            {/* Button container */}
            <div className="w-1/2 flex items-center justify-between m-auto">
              <button
                type="button"
                className="bg-green-700 rounded-xl p-1 text-xl text-white w-1/3 text-center"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Yes
              </button>
              <button
                type="button"
                className="bg-red-700 rounded-xl p-1 text-xl text-white w-1/3 text-center"
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
