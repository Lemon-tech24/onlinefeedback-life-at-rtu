"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PostData } from "@/types";
import useSWR from "swr";
import Form from "../components/Form";
import axios from "axios";
import FormEdit from "../components/FormEdit";

function Home() {
  const { data: session, status } = useSession();

  //edit mode
  const [edit, setEdit] = useState<{ [postId: string]: boolean }>({});

  //router
  const router = useRouter();

  //Add Post Overlay
  const [isOpen, setOpen] = useState(false);

  //Logout Overlay
  const [isOpenLogout, setOpenLogout] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  //validate current user and redirect if not log in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

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

          if (!data.added) {
            return;
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [status, session]);

  //end of validate current user

  //fetcher
  const fetcher = (url: string, options: string) =>
    axios.post(url).then((res) => res.data);

  const { data, error, isLoading, isValidating } = useSWR(
    "/api/post/data",
    fetcher,

    {
      refreshInterval: 1800,
      loadingTimeout: 2000,
    }
  );

  console.log(data);
  return (
    <div className="w-full">
      <div className="w-full px-8 py-3 flex items-center justify-between">
        <p className="text-2xl">
          {status === "loading" ? `Loading...` : `Hello,${session?.user?.name}`}
        </p>
        <button
          className="text-md uppercase"
          onClick={() => setOpenLogout(true)}
        >
          Logout
        </button>

        {isOpenLogout ? (
          <div>
            <p>Are you sure you want to logout?</p>{" "}
            <div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Yes
              </button>
              <button type="button" onClick={() => setOpenLogout(false)}>
                No
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <button onClick={handleOpen}>Add Feedback</button>
      {isOpen && session ? (
        <Form email={session?.user?.email ?? null} setOpen={setOpen} />
      ) : null}
      {!session ? (
        <div>Loading</div>
      ) : (
        <div className="flex flex-wrap items-center justify-between">
          {isLoading ? (
            <div>Getting Data</div>
          ) : data ? (
            data.map((item: PostData, key: number) => {
              return (
                <div key={key} className="border-2 border-solid border-black">
                  {session.user?.email === item.user.email && (
                    <button
                      type="button"
                      onClick={() => setEdit({ ...edit, [item.id]: true })}
                    >
                      Edit Post
                    </button>
                  )}
                  <div className="">
                    {item.isChecked ? "Anonymous" : item.user.name}
                  </div>
                  <div className="text-wrap">{item.userId}</div>
                  <div className="">{item.title}</div>
                  <div className="">{item.content}</div>
                  {item.image && <img src={item.image} alt="PostImage" />}
                  {edit[item.id] && (
                    <>
                      <div>
                        <button
                          type="button"
                          onClick={() => setEdit({ ...edit, [item.id]: false })}
                        >
                          Cancel
                        </button>
                        <FormEdit
                          id={item.id}
                          userId={item.userId}
                          content={item.content}
                          image={item.image}
                          isChecked={item.isChecked}
                          title={item.title}
                          concern={item.concern}
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Home;
