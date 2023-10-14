"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VscLoading } from "react-icons/vsc";

function NotFound() {
  const [counter, setCounter] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const countdown = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    setTimeout(() => {
      router.push("/");
      clearInterval(countdown);
    }, 5000);

    return () => {
      clearInterval(countdown);
    };
  }, [router]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-2xl">
      <div className="text-7xl text-blue-800 animate-spin">
        <VscLoading />
      </div>
      <div>
        Link doesnt exist. Redirecting in {counter} seconds. Please Wait
      </div>
    </div>
  );
}

export default NotFound;
