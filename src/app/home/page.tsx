"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

import axios from "axios";

import Form from "../components/Form";

function Home() {
  const { data: session, status } = useSession();
  const [isOpen, setOpen] = useState(false);

  const controller = new AbortController();
  const signal = controller.signal;

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const addUser = async () => {
      if (status === "authenticated") {
        const response = await axios.post("/api/user/add", {
          email: session?.user?.email ?? null,
          name: session?.user?.name ?? null,
          signal,
        });

        const data = response.data;
        console.log(data);
      }
    };

    addUser();

    return () => controller.abort();
  }, [status, session, controller]);

  return (
    <main className="w-full">
      <div className="w-full px-8 py-3 flex items-center justify-between">
        <p className="text-2xl">
          {status === "loading" ? `Loading...` : `Hello,${session?.user?.name}`}
        </p>
        <button
          className="text-md uppercase"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Logout
        </button>
      </div>
      <button onClick={handleOpen}>Add Feedback</button>

      {isOpen && <Form isOpen={isOpen} setOpen={setOpen} />}
    </main>
  );
}

export default Home;
