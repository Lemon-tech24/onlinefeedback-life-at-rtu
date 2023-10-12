"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { NavData } from "../types";

function Navigation({ name, currentUser, setOpen }: NavData) {
  return (
    <div className="flex w-full items-center justify-between px-12 py-6">
      <div className="cursor-default text-3xl font-semibold">
        Hello, {name ? `${name.split(" ")[0]}` : "Loading.."}
      </div>
      <div className="flex items-center gap-5 text-xl font-medium">
        <button type="button" onClick={() => setOpen()}>
          Add Post
        </button>

        <button type="button" onClick={() => signOut({ callbackUrl: "/" })}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navigation;
