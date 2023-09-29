"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Form from "../components/Form";
import axios from "axios";

function Home() {
  const { data: session, status } = useSession();
  const [isOpen, setOpen] = useState(false);
  const controller = new AbortController();

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (
        status === "authenticated" &&
        session?.user?.email &&
        session?.user?.name
      ) {
        try {
          const userResponse = await axios.post("/api/user/add", {
            email: session.user.email,
            name: session.user.name,
          });

          const data = userResponse.data;

          console.log(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [status, session]);

  return (
    <div className="w-full">
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
      {isOpen ? <Form isOpen={isOpen} setOpen={setOpen}/>: null}
    <div className="flex flex-wrap">
      <div>
        sadasdasdasdasdsasadasdasdasdasdsasadasdasdasdasdsasadasdasdasdasdsa
        </div>
        <div>
        sadasdasdasdasdsasadasdasdasdasdsasadasdasdasdasdsasadasdasdasdasdsa
        </div>
        <div>
        sadasdasdasdasdsasadasdasdasdasdsasadasdasdasdasdsasadasdasdasdasdsa
        </div>
        <div>
        sadasdasdasdasdsasadasdasdasdasdsasadasdasdasdasdsasadasdasdasdasdsa
        </div>
        <div>
        sadasdasdasdasdsasadasdasdasdasdsasadasdasdasdasdsasadasdasdasdasdsa
        </div>
        <div>
        sadasdasdasdasdsasadasdasdasdasdsasadasdasdasdasdsasadasdasdasdasdsa
        </div>
      </div>
    </div>
  );
}

export default Home;
