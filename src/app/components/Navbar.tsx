"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

function Navbar() {
  const { data: session } = useSession();
  return (
    <div className="flex px-12 py-4 w-full items-center justify-between text-3xl bg-slate-700 text-white">
      {session && session.user ? (
        <>
          <p>Welcome, {session ? session.user.name : "Loading.."}</p>

          <button onClick={() => signOut({ callbackUrl: "/" })}>Logout</button>
        </>
      ) : (
        <>
          <p>Life @ RTU</p>

          <button
            className="text-2xl"
            onClick={() => signIn("google", { callbackUrl: "/content" })}
          >
            Login
          </button>
        </>
      )}
    </div>
  );
}

export default Navbar;
