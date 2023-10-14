import axios from "axios";
import React, { useState, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { BsHeart, BsHeartFill, BsPeopleFill } from "react-icons/bs";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { DataForm, DisplayForm } from "../types";
import Form from "./Form";
import useSWR from "swr";
import { useRouter } from "next/navigation";

function DisplayForms({ currentUserId, onCancel }: DisplayForm) {
  const [edit, setEdit] = useState<{ [postId: string]: boolean }>({});

  //open details btn
  const [details, setDetails] = useState<{ [postId: string]: boolean }>({});

  //delete Ref
  const deleteRef = useRef<HTMLButtonElement | null>(null);

  //deleteLoad
  const [deleteLoad, setDeleteLoad] = useState<boolean>(false);

  //routing the page
  const router = useRouter();

  //delete notif
  const [deleteNotif, setDeleteNotif] = useState<string>("");

  const fetcher = (url: string) => axios.post(url).then((res) => res.data);
  const { data, error, isLoading } = useSWR("/api/post/get/data", fetcher, {
    refreshInterval: 1100,
  });

  console.log(data);

  const DeletePost = async (postId: string) => {
    setDeleteLoad(true);
    if (deleteRef.current) {
      deleteRef.current.disabled = true;
    }

    try {
      console.log("delete clicked ");
      const response = await axios.post("/api/post/delete", { postId: postId });
      const data = response.data;

      if (data.success) {
        setDeleteNotif("Successfully Deleted");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setDeleteNotif("Error: Failed To Delete");
    }

    if (deleteRef.current) {
      deleteRef.current.disabled = false;
      setDeleteLoad(false);
    }

    setTimeout(() => {
      setDeleteNotif("");
    }, 800);
  };

  const capitalize = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="columns-4 gap-5 mb-4 mx-10">
      {isLoading
        ? "Getting Data"
        : data &&
          data.posts
            .slice(0)
            .reverse()
            .map((item: DataForm, key: string) => {
              return (
                <div
                  key={key}
                  className="mb-3 w-full overflow-auto break-inside-avoid p-3 rounded-2xl bg-slate-400/80 shadow-sm hover:shadow-2xl hover:duration-500 cursor-pointer"
                >
                  {/*Display Contents*/}
                  {currentUserId === item.userId ? (
                    <div className="w-full flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setEdit({ ...edit, [item.id]: true })}
                      >
                        Edit this Post
                      </button>

                      <button
                        type="button"
                        ref={deleteRef}
                        onClick={() => DeletePost(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    ""
                  )}

                  {/* Header */}
                  <div>
                    <p className="font-bold text-2xl break-words text-justify line-clamp-4 text-ellipsis w-full">
                      {item.title}
                    </p>
                    <p>Focus: {item.concern}</p>
                  </div>

                  {/* Content */}
                  <div className="bg-slate-100 rounded-xl p-5 flex items-center flex-col gap-5">
                    {/* Who Post it */}
                    <div className="flex items-center justify-start text-xl gap-1 w-full">
                      <div className="text-5xl">
                        <CgProfile />
                      </div>
                      {item.isChecked
                        ? `Anonymous ${
                            item.userId === currentUserId ? "(me)" : ""
                          }`
                        : item.user?.name
                        ? capitalize(atob(atob(item.user.name)))
                        : ""}
                    </div>

                    <div className="break-words text-justify line-clamp-4 text-ellipsis w-full">
                      {item.content}
                    </div>
                    {item.image && (
                      <img
                        src={item.image}
                        alt="Image"
                        loading="lazy"
                        className="contain w-full rounded-2xl"
                      />
                    )}
                    <div className="w-full flex items-center justify-center gap-16">
                      <div className="text-2xl">
                        <BsHeartFill fill={"red"} />
                      </div>

                      <div className="text-3xl">
                        <HiOutlineChatBubbleOvalLeftEllipsis />
                      </div>

                      <div className="text-2xl">
                        <BsPeopleFill />
                      </div>
                    </div>
                  </div>

                  {/*Edit FOrm*/}
                  {edit[item.id] && (
                    <Form
                      mode={"edit"}
                      initialData={{
                        id: item.id,
                        title: item.title,
                        content: item.content,
                        isChecked: item.isChecked,
                        concern: item.concern,
                        image: item.image,
                        userId: currentUserId,
                      }}
                      onCancel={() => {
                        setEdit({ ...edit, [item.id]: false });
                        onCancel();
                      }}
                    />
                  )}
                </div>
              );
            })}
    </div>
  );
}

export default DisplayForms;
