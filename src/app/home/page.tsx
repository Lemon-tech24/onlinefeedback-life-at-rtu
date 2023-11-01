"use client";
import { useEffect, useState, useRef } from "react";
import { DataForm, UserData } from "@/app/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navigation from "../components/Navigation";
import Form from "../components/Form";

import DisplayForms from "../components/DisplayForms";

function Page() {
  //Form Open state
  const [isOpen, setOpen] = useState<boolean>(false);

  //routing the page
  const router = useRouter();

  //current user
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  //current id of who login
  const [currentUserId, setCurrentUser] = useState<string>("");

  function capitalize(str: string) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  //checking the user
  useEffect(() => {
    (async () => {
      if (status === "loading") {
        return;
      }

      try {
        if (status === "authenticated") {
          const sessionName = session?.user?.name;

          const capitlizeName =
            typeof sessionName === "string"
              ? capitalize(sessionName.toLowerCase())
              : undefined;

          const response = await axios.post("/api/user/add", {
            email: session?.user?.email,
            name: capitlizeName,
          });

          const AddUser = await response.data;

          console.log("Adding User Email ", AddUser);

          const getUserId = await axios.post("/api/user/get/data", {
            email: session?.user?.email,
          });

          const userData = await getUserId.data;

          console.log("user id login: ", userData);

          setCurrentUser(userData.userId);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [session, status, router]);

  console.log(session);

  //Add Mode
  const formData: DataForm = {
    id: "",
    title: "",
    userId: currentUserId,
    content: "",
    isChecked: false,
    concern: "",
    image: "",
  };

  return (
    <div
      className="flex flex-col bg-cover bg-no-repeat sm:bg-fill min-h-screen"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <Navigation
        name={session?.user?.name ?? ""}
        setOpen={() => setOpen(true)}
      />

      {isOpen && (
        <>
          <p
            style={{ backgroundColor: "#DBD9D9" }}
            className="p-1 rounded-lg text-xs font-semibold break-words w-3/12 text-justify fixed bottom-12 left-10 animate-fadeIn"
          >
            Share your thoughts anonymously by clicking the anonymous icon and
            you can add photo if you want. *Maximum 1 photo only*
          </p>
          <Form
            mode={"add"}
            initialData={formData}
            onCancel={() => setOpen(false)}
          />
        </>
      )}

      {session && (
        <DisplayForms
          currentUserId={currentUserId}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  );
}
export default Page;
